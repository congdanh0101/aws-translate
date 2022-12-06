document.getElementById("inputText").focus();
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.Credentials("AKIAVONMUA2J7QLZUT5W", "XTajl2OGK+gbqZP997lQqIxg7HYU8MOy+wTTyfIZ");
var translate = new AWS.Translate({ region: AWS.config.region });
var polly = new AWS.Polly(); var s3 = new AWS.S3();
document.getElementById("dload").onclick = function () {
    var l = document.createElement("a"); l.href = "data:text/plain;charset=UTF-8," +
        document.getElementById("outputText").value; l.setAttribute("output_download", document.getElementById("dload-fn").value);
    l.click();
}
function Export2Word(filename = "") {
    var
        preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
        ; var postHtml = "</body></html>"; var html = preHtml +
            document.getElementById('inputText').value + postHtml; var blob = new
                Blob(["\ufeff", html], { type: "application/msword", }); var
                    url = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);
    filename = filename ? filename + ".doc" : "Translate_Input.doc"; var
        downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink); if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        downloadLink.href = url;
        downloadLink.download = filename; downloadLink.click();
    }
    document.body.removeChild(downloadLink);
} function Export2Word1(filename = "") {
    var
        preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>"
        ; var postHtml = "</body></html>"; var html = preHtml +
            document.getElementById('outputText').value + postHtml; var blob = new
                Blob(["\ufeff", html], { type: "application/msword", }); var
                    url = "data:application/vnd.ms-word;charset=utf-8," + encodeURIComponent(html);
    filename = filename ? filename + ".doc" : "Translate_Output.doc"; var
        downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink); if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        downloadLink.href = url;
        downloadLink.download = filename; downloadLink.click();
    }
    document.body.removeChild(downloadLink);
} function loadFileAsText() {
    var
        fileToLoad = document.getElementById("filename").files[0]; var fileReader = new
            FileReader(); fileReader.onload = function (fileLoadedEvent) {
                var
                    textFromFileLoaded = fileLoadedEvent.target.result;
                document.getElementById("inputText").value = textFromFileLoaded;
            };
    fileReader.readAsText(fileToLoad, "UTF-8");
}
document.getElementById('inputText').onkeypress = function (e) {
    if
        (e.keyCode == 13) { document.getElementById('translate').click(); }
}
function doTranslate() {
    var inputText = document.getElementById('inputText').value;
    if (!inputText) {
        alert("Vui lòng nhập văn bản bạn muốn dịch");
        exit();
    } // get the language codes var
    var sourceDropdown = document.getElementById("sourceLanguageCodeDropdown");
    var sourceLanguageCode = sourceDropdown.options[sourceDropdown.selectedIndex].value;
    console.log(sourceLanguageCode)
    var targetDropdown = document.getElementById("targetLanguageCodeDropdown");
    var targetLanguageCode = targetDropdown.options[targetDropdown.selectedIndex].value;
    console.log(targetLanguageCode)
    var params = {
        Text: inputText,
        SourceLanguageCode: sourceLanguageCode,
        TargetLanguageCode: targetLanguageCode
    };
    translate.translateText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); alert("Error calling Amazon Translate. " + err.message);
            return;
        }
        if (data) {
            var outputTextArea = document.getElementById('outputText');
            outputTextArea.value = data.TranslatedText;
        }
    });
}

function doSynthesizeInput() {
    var text = document.getElementById('inputText').value.trim();
    if (!text) {
        return;
    }
    var sourceDropdown = document.getElementById("sourceLanguageCodeDropdown");
    var sourceLanguageCode = sourceDropdown.options[sourceDropdown.selectedIndex].value;
    doSynthesize(text, sourceLanguageCode);
} function doSynthesizeOutput() {
    var
        text = document.getElementById('outputText').value.trim(); if (!text) { return; }
    var targetDropdown = document.getElementById("targetLanguageCodeDropdown");
    var targetLanguageCode = targetDropdown.options[targetDropdown.selectedIndex].value;
    doSynthesize(text, targetLanguageCode);
} function doSynthesize(text,
    languageCode) {
    var voiceId; switch (languageCode) {
        case "ar": voiceId = "Zeina"
            ; break; case "da": voiceId = "Mads"; break; case "nl": voiceId = "Ruben";
            break; case "de": voiceId = "Marlene"; break; case "zh": voiceId = "Zhiyu";
            break; case "en": voiceId = "Joanna"; break; case "es": voiceId = "Penelope";
            break; case "fr": voiceId = "Celine"; break; case "pt": voiceId = "Vitoria";
            break; case "ja": voiceId = "Takumi"; break; case "ko": voiceId = "Seoyeon";
            break; case "ru": voiceId = "Maxim"; break; default: voiceId = null; break;
    } if
        (!voiceId) {
        alert("Hiện tại chưa hỗ trợ giọng nói cho ngôn ngữ \"" +
            languageCode + "\"");
        return;
    }
    var params = {
        OutputFormat: " mp3", SampleRate: "8000", Text: text, TextType: "text", VoiceId:
            voiceId
    }; polly.synthesizeSpeech(params, function (err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred alert("Error calling Amazon Polly. " + err.message);
        }
        else {
            var uInt8Array = new Uint8Array(data.AudioStream);
            var arrayBuffer = uInt8Array.buffer;
            var blob = new Blob([arrayBuffer]);
            var url = URL.createObjectURL(blob);

            audioElement = new Audio([url]);
            audioElement.play();
        }
    });
}

function clearInputs() {
    document.getElementById('inputText').value = "";
    document.getElementById('outputText').value = "";
    document.getElementById(" sourceLanguageCodeDropdown").value = "auto";
    document.getElementById("targetLanguageCodeDropdown").value = "vi";
    document.getElementById("filename").value = "";
} function swapText() {
    let
        inputText = document.getElementById('inputText').value; let
            outputText = document.getElementById('outputText').value;
    document.getElementById('inputText').value = outputText;
    document.getElementById('outputText').value = inputText; let
        source = document.getElementById("sourceLanguageCodeDropdown").value; let
            target = document.getElementById("targetLanguageCodeDropdown").value;
    document.getElementById("sourceLanguageCodeDropdown").value = target;
    document.getElementById("targetLanguageCodeDropdown").value = source;
} 