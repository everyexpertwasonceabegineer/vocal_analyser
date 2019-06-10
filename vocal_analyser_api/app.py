from flask import Flask
from flask import request
from flask import make_response
from flask import jsonify
from flask_cors import CORS
import Vokaturi
import json
import wave
import scipy.io.wavfile

# https://stackoverflow.com/questions/55271912/flask-cli-throws-oserror-errno-8-exec-format-error-when-run-through-docker
# https://askubuntu.com/questions/395124/how-come-a-python-file-is-executable-even-though-its-permissions-are-644
# exec permission removed from file


app = Flask(__name__)
CORS(app)

print("Loading library...")
Vokaturi.load("lib/open/macos/OpenVokaturi-3-3-mac64.dylib")
print("Analyzed by: %s" % Vokaturi.versionAndLicense())

@app.route("/vocal_analyser/api/analyse", methods =['POST'])
def analyse():
    print("Reading sound file...")
    data = request.files['wave']
    (sample_rate, samples) = scipy.io.wavfile.read(data)
    print("   sample rate %.3f Hz" % sample_rate)


    print("Allocating Vokaturi sample array...")
    buffer_length = len(samples)
    print("   %d samples, %d channels" % (buffer_length, samples.ndim))
    c_buffer = Vokaturi.SampleArrayC(buffer_length)
    if samples.ndim == 1:
        c_buffer[:] = samples[:] / 32768.0  # mono
    else:
        c_buffer[:] = 0.5*(samples[:,0]+0.0+samples[:,1]) / 32768.0  # stereo


    print("Creating VokaturiVoice...")
    voice = Vokaturi.Voice(sample_rate, buffer_length)


    print("Filling VokaturiVoice with samples...")
    voice.fill(buffer_length, c_buffer)

    print("Extracting emotions from VokaturiVoice...")
    quality = Vokaturi.Quality()
    emotionProbabilities = Vokaturi.EmotionProbabilities()
    voice.extract(quality, emotionProbabilities)

    if quality.valid:
        res =  jsonify(neutral= "%.3f" % emotionProbabilities.neutrality,
            happy="%.3f" % emotionProbabilities.happiness,
            sad="%.3f" % emotionProbabilities.sadness,
            angry="%.3f" % emotionProbabilities.anger,
            fear="%.3f" % emotionProbabilities.fear
        )
        res.headers['Access-Control-Allow-Origin'] = '*'
        print(res)
        return res
    else:
        return "no result"

    voice.destroy()



@app.route("/")
def hello():
    return "hello world"

if __name__ == '__main__':
    app.run(debug=True)
