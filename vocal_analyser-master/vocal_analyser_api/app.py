from flask import Flask
from flask import request
from flask import make_response
from flask import jsonify
from flask_cors import CORS
from watson_developer_cloud import AuthorizationV1 as Authorization
from watson_developer_cloud import IAMTokenManager
from watson_developer_cloud import SpeechToTextV1 as SpeechToText
from watson_developer_cloud import TextToSpeechV1 as TextToSpeech
from dotenv import load_dotenv
import Vokaturi
import os, json
import wave
import scipy.io.wavfile


# https://stackoverflow.com/questions/55271912/flask-cli-throws-oserror-errno-8-exec-format-error-when-run-through-docker
# https://askubuntu.com/questions/395124/how-come-a-python-file-is-executable-even-though-its-permissions-are-644
# exec permission removed from file

load_dotenv('REACT_APP_IBM.env')
app = Flask(__name__)
CORS(app)

# Speech to Text from
# https://github.com/watson-developer-cloud/speech-javascript-sdk/blob/master/examples/server.py
STT_USERNAME = os.environ.get('SPEECH_TO_TEXT_USERNAME') 	# '<Speech to Text username>'
STT_PASSWORD = os.environ.get('SPEECH_TO_TEXT_PASSWORD') 	# '<Speech to Text password>'
STT_APIKEY = os.environ.get('SPEECH_TO_TEXT_IAM_APIKEY') 	# '<Speech to Text IAM API key>'
STT_URL = os.environ.get('SPEECH_TO_TEXT_URL')	 			# '<Speech to Text URL>'

# on bluemix, automatically pull credentials from environment
if 'VCAP_SERVICES' in os.environ:
	stt = json.loads(os.environ['VCAP_SERVICES'])['speech_to_text'][0]
	STT_USERNAME = stt["credentials"]["username"]
	STT_PASSWORD = stt["credentials"]["password"]
	STT_APIKEY = stt["credentials"]["apikey"]
	STT_URL = stt["credentials"]["url"] if stt["credentials"]["url"] else SpeechToText.default_url
	tts = json.loads(os.environ['VCAP_SERVICES'])['text_to_speech'][0]
	TTS_USERNAME = tts["credentials"]["username"]
	TTS_PASSWORD = tts["credentials"]["password"]
	TTS_APIKEY = tts["credentials"]["apikey"]
	TTS_URL = tts["credentials"]["url"] if tts["credentials"]["url"] else TextToSpeech.default_url

# Vokaturi
print("Loading library...")
print(STT_APIKEY)
Vokaturi.load("lib/open/win/OpenVokaturi-3-3-win32.dll")
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

 # IBM Watson
@app.route('/api/speech-to-text/token')
def getSttToken():
	iamTokenManager = IAMTokenManager(iam_apikey=STT_APIKEY)
	token = iamTokenManager.get_token()

	return token

@app.route("/")
def hello():
    return "hello world"

# NOTE: ssl_context='adhoc' fixes response encoding (Flask 400 BAD_REQUEST) errors over SSL
if __name__ == "__main__":
    app.run(debug='true')
