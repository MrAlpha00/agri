const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const path = require('path');

const CLASSES = ['rice_blast', 'brown_spot', 'bacterial_leaf_blight', 'tungro', 'healthy'];
const NUM_CLASSES = CLASSES.length;
const IMAGE_SIZE = 224;

// Custom IOHandler to mock tfjs-node's file system saving mechanism
function customNodeIOSaver(dirPath) {
    return {
        save: async (modelArtifacts) => {
            fs.mkdirSync(dirPath, { recursive: true });
            const weightFileName = 'weights.bin';
            if (modelArtifacts.weightData) {
                const weightData = Buffer.from(modelArtifacts.weightData);
                fs.writeFileSync(path.join(dirPath, weightFileName), weightData);
            }

            const specs = modelArtifacts.weightSpecs || [];
            if (specs.length > 0) {
                modelArtifacts.weightsManifest = [{
                    paths: [weightFileName],
                    weights: specs
                }];
            }
            delete modelArtifacts.weightData;
            delete modelArtifacts.weightSpecs;

            fs.writeFileSync(path.join(dirPath, 'model.json'), JSON.stringify(modelArtifacts));

            return {
                modelArtifactsInfo: {
                    dateSaved: new Date(),
                    modelTopologyType: 'JSON',
                }
            };
        }
    };
}

// Add fetch polyfill if necessary
if (typeof fetch === 'undefined') {
    try {
        global.fetch = require('node-fetch');
    } catch (e) {
        console.warn("node-fetch not installed. Assuming Node 18+ native fetch.");
    }
}

async function run() {
    console.log('Loading MobileNet Base Model...');
    const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

    const layer = mobilenet.getLayer('conv_pw_13_relu');
    const truncatedModel = tf.model({ inputs: mobilenet.inputs, outputs: layer.output });

    for (const l of truncatedModel.layers) {
        l.trainable = false;
    }

    console.log('Building Custom Classification Head...');
    const model = tf.sequential();

    model.add(truncatedModel);
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: 100,
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
    }));

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

    console.log('Simulating Fake Training Data...');
    const NUM_EXAMPLES = 50;
    const xs = tf.randomUniform([NUM_EXAMPLES, IMAGE_SIZE, IMAGE_SIZE, 3], 0, 1);

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

    await model.save(customNodeIOSaver(exportPath));
    console.log(`Model successfully exported to: ${exportPath}`);

    fs.writeFileSync(path.join(exportPath, 'labels.json'), JSON.stringify(CLASSES, null, 2));

    console.log('Done!');
}

run().catch(console.error);
