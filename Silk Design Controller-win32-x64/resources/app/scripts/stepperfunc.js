if (window.module) module = window.module;
var rot_minval = 0;
var rot_maxval = 360;

var set_minval = 90; // arbitrary min 
var set_maxval = 180; // arbitrary max 

var SerialPort = require('serialport');


// var remote = require('remote'); // Load remote compnent that contains the dialog dependency
// var dialog = remote.require('dialog'); // Load the dialogs component of the OS
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
resolve = require('path').resolve

var app = require('electron').remote;
var dialog = app.dialog;
// Or with ECMAScript 6
// const { dialog } = require('electron').remote;
const notifier = require('electron-notifications')




$(document).ready(function () {
    $("#slider").slider(
        {
            range: true,
            min: 0,
            max: 360,
            step: 1,
            values: [set_minval, set_maxval],
            change: showValue
        });




    $("#save_btn").click(function () {
        if ($.trim($("textarea").val()) != "") {
            let content = $("textarea").val();
            //alert($("textarea").val());
            // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
            dialog.showSaveDialog((fileName) => {
                if (fileName === undefined) {
                    console.log("You didn't save the file");
                    return;
                }

                // fileName is a string that contains the path and filename created in the save file dialog.  
                fs.writeFile(fileName, content, (err) => {
                    if (err) {
                        alert("An error ocurred creating the file " + err.message)
                    }
                    // Just title 
                    // notifier.notify('Silk Design Controller')

                    // Full Options 
                    var imagepath = resolve('.//images//savefile.png');
                    const notification = notifier.notify('Silk Design Controller', {
                        message: 'The file has been succesfully saved',
                        icon: imagepath,
                        buttons: ['Dismiss'],//, 'Snooze'
                    })

                    notification.on('buttonClicked', (text, buttonIndex, options) => {
                        // if (text === 'Snooze') {
                        //   // Snooze! 
                        // } else if (buttonIndex === 1) {
                        //   //open options.url 
                        // }
                        notification.close()
                    })

                    // alert("The file has been succesfully saved");
                });
            });
        } else {
            alert("No Data to Save");
        }

        //Read File or Files
        // dialog.showOpenDialog((fileNames) => {
        //     // fileNames is an array that contains all the selected
        //     if(fileNames === undefined){
        //         console.log("No file selected");
        //         return;
        //     }

        //     fs.readFile(filepath, 'utf-8', (err, data) => {
        //         if(err){
        //             alert("An error ocurred reading the file :" + err.message);
        //             return;
        //         }

        //         // Change how to handle the file content
        //         console.log("The file content is : " + data);
        //     });
        // });


        // Note that the previous example will handle only 1 file, if you want that the dialog accepts multiple files, then change the settings:
        // And obviously , loop through the fileNames and read every file manually
        // dialog.showOpenDialog({ 
        //     properties: [ 
        //         'openFile', 'multiSelections', (fileNames) => {
        //             console.log(fileNames);
        //         }
        //     ]
        // });

    });

    $("#update_btn").click(function () {
        set_minval = parseInt($("#minrot").val());
        set_maxval = parseInt($("#maxrot").val());
        if (set_minval > set_maxval) {
            alert("Rotation parameters are Invalid : " + set_minval + " > " + set_maxval);
            $("#minrot").val(rot_minval);
            $("#maxrot").val(rot_maxval);
            $('#minrot').attr('min', rot_minval);
            $('#maxrot').attr('min', rot_minval);
            $('#minrot').attr('max', rot_maxval);
            $('#maxrot').attr('max', rot_maxval);
            $("#slider").slider("option", "values", [rot_minval, rot_maxval]);
        } else {

            $("#slider").slider("option", "values", [set_minval, set_maxval]);

            var portlist = document.getElementById("portlist");
            var selectedport = portlist.options[portlist.selectedIndex].value;

            var stepdirectionlist = document.getElementById("stepdirection");
            var stepdirection = stepdirectionlist.options[stepdirectionlist.selectedIndex].value;

            var stepwidthlist = document.getElementById("stepwidth");
            var stepwidth = stepwidthlist.options[stepwidthlist.selectedIndex].value;

            var motordrivelist = document.getElementById("motordrive");
            var motordrive = motordrivelist.options[motordrivelist.selectedIndex].value;


            // alert("PORT : " + selectedport + "\n" + "DEG MIN: " + set_minval + "\n" + "DEG MAX: " + set_maxval + "\n" + "DIR : " + stepdirection + "\n" + "STP : " + stepwidth + "\n" + "MOT : " + motordrive);

            $("#portresponse").val(function () {
                return this.value + "PORT: " + selectedport + "," + "DEG_MIN: " + set_minval + "," + "DEG_MAX: " + set_maxval + "," + "DIR: " + stepdirection + "," + "STP: " + stepwidth + "," + "MOT: " + motordrive + "\n";
            });



            var port = new SerialPort(selectedport, function (err) { //, { autoOpen: false }
                if (err) {
                    return console.log('Error: ', err.message);
                }
                //"DEG", "DIR", "STP", "MOT"
                port.write('MIN:' + set_minval, function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                    console.log('MIN:' + set_minval);
                });

                port.write('MAX:' + set_minval, function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                    console.log('MAX:' + set_minval);
                });


                port.write('DIR:' + stepdirection, function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                    console.log('DIR:' + stepdirection);
                });

                port.write('STP:' + stepwidth, function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                    console.log('STP:' + stepwidth);
                });

                port.write('MOT:' + motordrive, function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                    console.log('MOT:' + motordrive);
                });

            });

        }

    });
    function showValue(event, ui) {
        $("#minrot").val(ui.values[0]);
        $("#maxrot").val(ui.values[1]);

        $('#minrot').attr('min', rot_minval);
        $('#maxrot').attr('min', ui.values[0]);

        $('#minrot').attr('max', ui.values[1]);
        $('#maxrot').attr('max', rot_maxval);

    }

    $('#minrot').attr('placeholder', rot_minval);
    $('#maxrot').attr('placeholder', rot_maxval);

    $("#minrot").val(set_minval);
    $("#maxrot").val(set_maxval);

    $('#minrot').attr('min', rot_minval);
    $('#maxrot').attr('min', set_minval);

    $('#minrot').attr('max', set_maxval);
    $('#maxrot').attr('max', rot_maxval);


    // Link up Min and Max Rotation Step
    $('#minrot').bind('keyup mouseup', function () {
        update_btn.click();
    });
    $('#maxrot').bind('keyup mouseup', function () {
        update_btn.click();
    });

    SerialPort.list(function (err, ports) {
        ports.forEach(function (port) {
            console.log(port.comName);
            // console.log(port.pnpId);
            // console.log(port.manufacturer);
            var select = document.getElementById('portlist');
            var option = document.createElement('option');
            option.value = option.text = port.comName;
            select.add(option);
        });
    });


});
