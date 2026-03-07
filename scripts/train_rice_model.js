const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

const CLASSES = ['rice_blast', 'brown_spot', 'bacterial_leaf_blight', 'tungro', 'healthy'];
const NUM_CLASSES = CLASSES.length;
const IMAGE_SIZE = 224;

async function run() {
    console.log('Loading MobileNet Base Model...');
    // We load a pre-trained MobileNet model
    const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

    // We get a specific layer from MobileNet to use as the feature extractor
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    const truncatedModel = tf.model({ inputs: mobilenet.inputs, outputs: layer.output });

    // Freeze the weights of the pre-trained model so they don't change during our brief training
    for (const l of truncatedModel.layers) {
        l.trainable = false;
    }

    console.log('Building Custom Classification Head...');
    const model = tf.sequential();

    // Add the base model as a layer
    model.add(truncatedModel);

    // Flatten the spatial dimensions
    model.add(tf.layers.flatten());

    // Add a dense layer for our custom classes
    model.add(tf.layers.dense({
        units: 100,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
    }));

    // Output layer with softmax activation
    model.add(tf.layers.dense({
        units: NUM_CLASSES,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
    }));

    model.compile({
        optimizer: tf.train.adam(0.0001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    model.summary();

    console.log('Simulating Fake Training Data...');
    // Since we don't have the real dataset, we simulate training on dummy data
    // to establish the structure and weights of the model so it can be exported.

    // Create random images and one-hot encode labels
    const NUM_EXAMPLES = 50;
    const xs = tf.randomUniform([NUM_EXAMPLES, IMAGE_SIZE, IMAGE_SIZE, 3], 0, 1);

    // Random labels (0 to 4) mapped to one-hot arrays
    const labelsArray = Array.from({ length: NUM_EXAMPLES }, () => Math.floor(Math.random() * NUM_CLASSES));
    const ys = tf.oneHot(tf.tensor1d(labelsArray, 'int32'), NUM_CLASSES);

    console.log('Training Model (Simulated)...');
    await model.fit(xs, ys, {
        epochs: 5,
        batchSize: 10,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
        }
    });

    console.log('Saving model to public directory...');
    const exportPath = path.resolve(__dirname, '../public/model');

    if (!fs.existsSync(exportPath)) {
        fs.mkdirSync(exportPath, { recursive: true });
    }

    await model.save(`file://${exportPath}`);
    console.log(`Model successfully exported to: ${exportPath}`);

    // Generate a labels file for the frontend maps
    fs.writeFileSync(path.join(exportPath, 'labels.json'), JSON.stringify(CLASSES, null, 2));

    console.log('Done!');
}

run().catch(console.error);
