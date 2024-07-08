import { CameraController } from './CameraController.js'
import { MicrophoneController } from './MicrophoneController.js'
import { DocumentPreviewController } from './DocumentPreviewController.js'
import { Format } from './../Utils/Format.js';
import { Firebase } from './../Utils/Firebase.js';
import { User } from '../model/User.js';
import { setDoc, doc, collection, addDoc } from "firebase/firestore";
import { Model } from './../model/Model.js';
import { ClassEvent } from '../Utils/ClassEvent.js';


export class WhatsAppController {

    constructor() {
        this._firebase = new Firebase();
        this._classEvent = new ClassEvent();
        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();

    }

    async initAuth() {

        Firebase.iniAuth().then((response) => {

            this._user = new User(response.user.email);
            console.log("this._user CHEGOU PERTO DO OOOOOOOOOOOOOOONNNNNNNNNN");
            this._classEvent.eventOn('datachange', data =>{
                console.log("datachange", data);

                document.querySelector('title').innerHTML = data.name + ' - WhatsAppClone';
                this.el.inputNamePanelEditProfile.innerHTML = data.name;

                if (data.photo){
                    let photo = this.el.imgPanelEditProfile;
                    photo.src = data.photo;
                    photo.show();
                    this.el.imgDefaultPanelEditProfile.hide();

                    let photo2 = this.el.myPhoto.querySelector('img');
                    photo2.src = data.photo;
                    photo2.show();
                }
            });

            const newUser = {
                name:response.user.displayName,
                email: response.user.email,
                photo:response.user.photoURL,
            };

            const docRef = doc(Firebase.db(), 'users', newUser.email);

            setDoc(docRef, newUser);


            console.log("response",response, response.token);


            // let userRef = User.getById(response.user.email);   

            this._user.name = response.user.displayName;
            console.log(this._user.name);
            this._user.email = response.user.email;
            this._user.photo = response.user.photoURL;

            this._user.save().then(()=>{
                this.el.appContent.css({
                    display: 'flex'
                });
            });

        }).catch(err => {

            console.error(err);

        });

    }



    loadElements() {

        //Select All the id's in the HTML file and put it in this.el

        this.el = {};

        document.querySelectorAll('[id]').forEach(element => {

            this.el[Format.getCamelCase(element.id)] = element;

        });

    }

    elementsPrototype() {

        //Make a few functions for programming in a easier way

        Element.prototype.hide = function () {

            this.style.display = 'none';

            return this;
        }

        Element.prototype.show = function () {

            this.style.display = 'block';

            return this;
        }

        Element.prototype.toggle = function () {

            this.style.display = (this.style.display === 'none') ? 'block' : 'none';

            return this;
        }

        Element.prototype.on = function (events, fn) {

            events.split(' ').forEach(event => {

                this.addEventListener(event, fn);

            });

            return this;
        }

        Element.prototype.css = function (styles) {

            for (let name in styles) {

                this.style[name] = styles[name];

            }

            return this;
        }

        Element.prototype.addClass = function (name) {

            this.classList.add(name);

            return this;
        }

        Element.prototype.removeClass = function (name) {

            this.classList.remove(name);

            return this;

        }

        Element.prototype.toggleClass = function (name) {

            this.classList.toggle(name);

            return this;
        }

        Element.prototype.hasClass = function (name) {

            return this.classList.contains(name);
        }

        HTMLFormElement.prototype.getForm = function () {

            return new FormData(this);

        }

        HTMLFormElement.prototype.toJSON = function () {

            let json = {};


            this.getForm().forEach((value, key) => {

                json[key] = value;


            });

            return json;

        }

    }

    initEvents() {

        //Inital Events look for all initial events

        this.el.myPhoto.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();

            setTimeout(() => {
                //Necessary for the css goes smoothly

                this.el.panelEditProfile.addClass('open');

            }, 300);

        });

        this.el.btnNewContact.on('click', e => {

            this.closeAllLeftPanel();
            this.el.panelAddContact.show();

            setTimeout(() => {
                //Necessary for the css goes smoothly

                this.el.panelAddContact.addClass('open');

            }, 300);

        });

        this.el.btnClosePanelEditProfile.on('click', e => {

            this.el.panelEditProfile.toggleClass('open');

        });

        this.el.btnClosePanelAddContact.on('click', e => {

            this.el.panelAddContact.toggleClass('open');

        });

        this.el.photoContainerEditProfile.on('click', e => {

            this.el.inputProfilePhoto.click();

        });

        this.el.inputNamePanelEditProfile.on('keypress', e => {

            if (e.key == "Enter") {

                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();

            }

        });

        this.el.btnSavePanelEditProfile.on('click', e => {


            console.log(this.el.inputNamePanelEditProfile.innerHTML);
        });

        this.el.formPanelAddContact.on('submit', e => {

            e.preventDefault();


            formData = new FormData(this.el.formPanelAddContact);

        });

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

            item.on('click', e => {

                this.el.home.hide();

                this.el.main.css({

                    display: 'flex'

                });

            });


        });

        this.el.btnAttach.on('click', e => {

            this.el.menuAttach.toggleClass('open');




            e.stopPropagation();

            document.addEventListener('click', this.closeMenuAttach.bind(this));



        });

        this.el.btnAttachPhoto.on('click', e => {

            this.el.inputPhoto.click();

        });

        this.el.inputPhoto.on('change', e => {

            console.log(this.el.inputPhoto.files);

            [...this.el.inputPhoto.files].forEach(file => {

                console.log(file);


            });


        });

        this.el.btnAttachCamera.on('click', e => {

            this.closeAllMainPanel();

            this.el.panelCamera.addClass('open');

            this.el.panelCamera.css({

                height: '100%'

            });

            this._camera = new CameraController(this.el.videoCamera);

        });


        this.el.btnClosePanelCamera.on('click', e => {


            this._camera.stop();
            this.closeAllMainPanel();

            this.el.panelMessagesContainer.show();

        })

        this.el.btnTakePicture.on('click', e => {

            let dataUrl = this._camera.takePicture()

            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this._camera.stop();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();

        });

        this.el.btnReshootPanelCamera.on('click', e => {

            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();

        });

        this.el.btnSendPicture.on('click', e => {



        });

        this.el.btnAttachDocument.on('click', e => {


            this.closeAllMainPanel();

            this.el.panelDocumentPreview.show();

            this.el.panelDocumentPreview.css({

                height: '57%'

            });
            this.el.inputDocument.click();

        });

        this.el.inputDocument.on('change', e => {

            if (this.el.inputDocument.files.length) {

                let file = this.el.inputDocument.files[0];

                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result => {

                    this.el.imgPanelDocumentPreview.src = result.src;

                    this.el.infoPanelDocumentPreview.innerHTML = result.info;

                    this.el.imagePanelDocumentPreview.show();

                    this.el.filePanelDocumentPreview.hide();

                }).catch(err => {

                    console.log(file.type);

                    switch (file.type) {

                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        case 'application/msword':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                            break;

                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':

                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                            break;

                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        case 'application/vnd.ms-powerpoint':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                            break;

                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';

                            break;


                    }


                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();

                    this.el.filePanelDocumentPreview.show();


                });

                console.log(file);


            }

        });

        this.el.btnClosePanelDocumentPreview.on('click', e => {

            this.closeAllMainPanel();

            this.el.panelMessagesContainer.show();

            this.el.filePanelDocumentPreview.hide();

        });

        this.el.btnSendDocument.on('click', e => {

            console.log('btnSendDocument');

            this.el.filePanelDocumentPreview.hide();

        });

        this.el.btnAttachContact.on('click', e => {

            this.el.modalContacts.show();

        });

        this.el.btnCloseModalContacts.on('click', e => {

            this.el.modalContacts.hide();

        });

        this.el.btnSendMicrophone.on('click', e => {

            this.el.btnSendMicrophone.hide();
            this.el.recordMicrophone.show();

            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', audio => {

                console.log('ready', audio);

                this._microphoneController.startRecorder();

            });

            this._microphoneController.on('recordtimer', timer => {

                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);


            });

        });

        this.el.btnCancelMicrophone.on('click', e => {


            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();


        });

        this.el.btnFinishMicrophone.on('click', e => {
            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();


        });

        this.el.inputText.on('keypress', e => {

            if (e.key === 'Enter' && !e.shiftKey) {

                e.preventDefault();
                this.el.btnSend.click();

            }

        });

        this.el.inputText.on('keyup', e => {

            if (this.el.inputText.innerHTML.length) {


                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();

            } else {

                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();

            }

        });

        this.el.btnSend.on('click', e => {

            console.log(this.el.inputText.innerHTML);

        });

        this.el.btnEmojis.on('click', e => {

            this.el.panelEmojis.toggleClass('open');

        });

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {

            emoji.on('click', e => {

                console.log(emoji.dataset.unicode);

                let img = this.el.imgEmojiDefault.cloneNode();

                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name => {

                    img.classList.add(name);

                });

                let cursor = window.getSelection();

                if (!cursor.focusNode) {
                    this.el.inputText.focus();

                }


                let range = document.createRange();

                range = cursor.getRangeAt(0);

                range.deleteContents();

                let frag = document.createDocumentFragment();

                frag.appendChild(img);

                range.insertNode(frag);

                range.setStartAfter(img);

                this.el.inputText.dispatchEvent(new Event('keyup'));

            });



        })

    }

    closeRecordMicrophone() {

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();

        this.el.recordMicrophoneTimer.innerHTML = 0;

    }

    closeAllMainPanel() {

        this.el.modalContacts.hide();
        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelDocumentPreview.hide();
        this.el.panelCamera.removeClass('open');

    }

    closeMenuAttach(e) {

        if (!this.el.menuAttach.hasClass('open')) return true;

        document.removeEventListener('click', this.closeMenuAttach);

        this.el.menuAttach.removeClass('open');

    }

    closeAllLeftPanel() {
        //Close panels, necessary because a few panels are in front of others
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();


    }
}
