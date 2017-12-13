Polymer({
    is: 'kul-widget',
    properties: {
        component: {
            type: String
        },
        version: {
            type: String
        },
        configId: {
            type: String
        },
        modelId: {
            type: String
        }
    },

    // _updateConfig: function(configId) {
    //     console.log('configId: ', configId)
    // },

    // _updateModel: function(modelId) {
    //     console.log('modelId: ', modelId)
    // },
    
    /**
     * 
     */
    ready: function() {
        console.log('component: ', this.component)
        console.log('version: ', this.version)
        console.log('configId: ', this.configId)
        console.log('modelId: ', this.modelId)
        // Get the config file from the database
        let database = new PouchDB('config')
        // let database = new PouchDB('http://localhost:5984/config')
        // database.replicate.to('http://localhost:5984/config')
        let CONFIG = {}
        let SETTINGS = {}
        let DATA = {}
        database.get(this.configId, function (err, config) {
            if (err)
                return console.log(err)
            // Set the CONFIG
            CONFIG = config
            console.log('DB GET::CONFIG >>> ', CONFIG)
            // Get the settings file from the database
            // database.get(this.settingsId, function (err, settings) {
            //     if (err)
            //         console.warn('DB ERROR >>> ', err)
            //     // Set the SETTINGS
            //     SETTINGS = settings
            // }.bind(this))
            // Get the component model from the database
            database.get(this.modelId, function (err, data) {
                if (err)
                    console.warn('DB ERROR >>> ', err)
                // Set the CONFIG
                DATA = data
                // Get the component view from the config file
                let currentVersion = CONFIG.component.currentVersion
                if (this.version){
                    CONFIG = CONFIG.component.version[this.version]
                } else {    
                    CONFIG = CONFIG.component.version[currentVersion]
                }                
                // console.log('CONFIG >>> ', CONFIG)
                let template = CONFIG.interface.template
                // console.log('template >>> ', template)
                
                // Convert the HTML string to DOM Elements
                let elements = utils.str2DOMElement(template)
                // console.log('elements: ', elements)
                // Loop through the DOM Elements and add the required attributes
                for (var i = 0; i < elements.length; i++) {
                    let elementName = elements[i].nodeName
                    let elementAttrs = elements[i].attributes
                    if (elementName !== '#text') {
                        // Get the data model from the SDO_VIEWMODEL config data model  
                        let model = _.filter(CONFIG.elements, {
                            id: elements[i].id
                        })[0]
                        // console.log('CONFIG.elements: ', CONFIG.elements) 
                        // Create the KUL Element
                        let KElement = new KULElement(elementName, model, this, true)
                        let element = KElement.getView()
                        // Set the attributes
                        for (var j = 0; j < elementAttrs.length; j++) {
                            element.setAttribute(elementAttrs[j].name, elementAttrs[j].value)
                        }
                        // Set the inner text
                        // @ts-ignore
                        // element.childNodes[1].innerText = elements[i].innerText.split('\n').join('').split(' ').join('')
                        // Set the width and height
                        // Set to 'width: 100%; height: 100%' by default to adjust to the size
                        // of the parent element
                        if (element.style.height || element.style.width) {
                            let height = parseInt(element.style.height.replace('px', ''))
                            let width = parseInt(element.style.width.replace('px', ''))
                            if (height > 0 || width > 0) {
                                // @ts-ignore
                                element.childNodes[1].style = 'width: 100%; height: 100%'
                            }
                        }
                        // Append child element to the canvas DOM
                        Polymer.dom(this.$.include).appendChild(element)
                    }
                }

            }.bind(this))                        

        }.bind(this))        
    }

});