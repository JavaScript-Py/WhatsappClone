import { ClassEvent } from "../Utils/ClassEvent";

export class MicrophoneController extends ClassEvent {

    constructor() {

        super();

        this._mimeType = 'audio/webm';

        this._available = false;

        const constraints = {
            audio: true,
            video: true,
          };

        navigator.mediaDevices.getUserMedia(constraints).then(stream => {

            this._stream = stream;

            this._available = true;

            this.trigger('ready', this._stream); 

            

        }).catch(err => {

            console.error(err);

        });

    }

    isAvailable() {


        return this._available;

    }

    stop() {

        this._stream.getTracks().forEach(track => {

            track.stop();

        })

    }

    startRecorder() {
        if (this.isAvailable()) {

            this._mediaRecorder = new MediaRecorder(this._stream, {

                mimeType: this._mimeType

            });

            console.log(this._mediaRecorder);

            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e => {

                if (e.data.size > 0) this._recordedChunks.push(e.data);

            });


            this._mediaRecorder.addEventListener('stop', e => {

                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType

                });

                let filename = `rec${Date.now()}.webm`;

                let file = new File([blob], filename, {

                    type: this._mimeType,
                    lastModified: Date.now()

                });


                console.log('file', file);               

                var a = document.createElement('a');

                a.href = window.URL.createObjectURL(file);

                a.download = filename;

                a.click();
            

            });

            this._mediaRecorder.start();
            this.startTimer();

        }


    }

    stopRecorder() {

        console.log(this._mediaRecorder);

        if (this.isAvailable()) {

            this.stop();
 
            this._mediaRecorder.stop();

            this.stopTimer();

        }


    }

    startTimer() {

        

        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger('recordtimer', Date.now() - start);


        }, 100);

    }


    stopTimer() {

        clearInterval(this._recordMicrophoneInterval);
    }


}