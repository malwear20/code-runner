var beautify = ace.require("ace/ext/beautify");

var code;
var cdn = [];
var cdnCounter = 0;

var editorHTML = ace.edit("editorHTML");
editorHTML.setTheme("ace/theme/xcode");
editorHTML.session.setMode("ace/mode/html");
editorHTML.session.setNewLineMode("unix");
editorHTML.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});


var editorJS = ace.edit("editorJS");
editorJS.setTheme("ace/theme/xcode");
editorJS.session.setMode("ace/mode/javascript");
editorJS.session.setNewLineMode("unix");
editorJS.session.setValue("// Enter your JavaScript code here");
editorJS.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

var editorCSS = ace.edit("editorCSS");
editorCSS.setTheme("ace/theme/xcode");
editorCSS.session.setMode("ace/mode/css");
editorCSS.session.setNewLineMode("unix");
editorCSS.session.setValue("/*Enter your stylesheets here*/");
editorCSS.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

window.onload = function ()
{
    editorHTML.setValue("<html>\n" +
        "    <head>\n" +
        "        <title> Code Runner </title>\n" +
        "        <style>\n" +
        "            /*USE THE CSS TAB TO ENTER CSS COMMANDS*/\n" +
        "        </style>\n" +
        "           <!--USE THE CDN TAB TO INCLUDE 3rd PARTY STYLESHEETS AND SCRIPTS-->\n" +
        "    </head>\n" +
        "    <body>\n" +
        "        <!--Enter content here-->\n" +
        "        <h1> HELLO WORLD </h1>\n" +
        "    </body>\n" +
        "    <script>\n" +
        "        // USE THE SCRIPT TAB TO ENTER JS CODE\n" +
        "    </script>\n" +
        "</html>");
    localStorage.setItem(queryparamname, getHTMLContent());
    generatePreviewContent();
    //generatePreviewContent();
}

var getHTMLContent = function () {
    return editorHTML.getValue();
}

var getCSSContent = function () {
    return editorCSS.getValue();
}

var getJSContent = function () {
    return editorJS.getValue();
}

var setHTMLContent = function (content) {
    editorHTML.setValue(content);
}

var beautifyHTML = function () {
    beautify.beautify(editorHTML.session);
}

var setPreview = function (content) {
    document.getElementById('output').src = "data:text/html;charset=utf-8," + escape(content);
}

var generatePreviewContent = function () {
    var html = localStorage[queryparamname];
    setPreview(html);
}

function addCDN() {
    var cdnTypes = document.getElementsByName("cdnType");

    if(document.getElementById("cdnLink").value != "")
    {
        var link = document.getElementById("cdnLink").value;
        var type;
        if(cdnTypes[0].checked == true)
        {
            type = "JS";
        }
        else if(cdnTypes[1].checked == true)
        {
            type = "CSS";
        }
        cdn.push({id:cdnCounter,type:type,link:link});
        console.log(cdn);
        console.log(cdn[cdnCounter]);
        console.log(cdn[cdnCounter].type);
        cdnCounter++;

        clearTable();
        generateTable();

        insertCDN();

        document.getElementById("cdnLink").value = "";
    }
    else
    {
        alert("Enter a valid CDN link");
    }

}

function clearTable() {
    var table = document.getElementById("list");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function generateTable() {
    var table = document.getElementById("list");
    for (i = 0; i < cdn.length; i++) {
        if(cdn[i]!= undefined) {
            var row = table.insertRow();
            var cell = row.insertCell();
            cell.innerText = cdn[i].type;
            var cell = row.insertCell();
            cell.innerText = cdn[i].link;
            var cell = row.insertCell();
            var rm = document.createElement("input");
            rm.type = "button";
            rm.id = "rm" + cdn[i].id;
            rm.value = "REMOVE CDN LINK";
            rm.style.width = "100%";
            rm.style.height = "50px";
            rm.style.textAlign = "center";
            rm.style.backgroundSize = "70px 50px";
            rm.style.backgroundColor = "#f44336";
            rm.style.fontSize = "12px";
            rm.setAttribute("onclick","removeCDN("+cdn[i].id+");");
            cell.appendChild(rm);
        }
    }
    if(table.rows.length == 1)
    {
        table.style.display = "none";
    }
    else
    {
        table.style.display = "block";
    }
}

function removeCDN(id) {
    delete cdn[id];
    console.log(cdn);

    clearTable();
    generateTable();

    insertCDN();
}

function insertCDN()
{
    var cdns = "";
    for(i=0;i<cdn.length;i++)
    {
        if(cdn[i]!= undefined)
        {
            if(cdn[i].type=="JS")
            {
                var str = "<script type='text/javascript' src='";
                str = str + cdn[i].link;
                str = str + "'></script>";
            }
            else if(cdn[i].type=="CSS")
            {
                var str = "<link rel='stylesheet' href='";
                str = str + cdn[i].link;
                str = str + "'>";
            }
            cdns = cdns + str + "\n";
        }
    }

    code = localStorage[queryparamname];
    var cdnIndex = code.indexOf("SCRIPTS-->");
    var cdnLastIndex = code.indexOf("</head>");
    code = code.substring(0,cdnIndex+10) + cdns + code.substring(cdnLastIndex,code.length);
    console.log(code);
    localStorage.setItem(queryparamname, code);
}

function insertCSS () {
    code = localStorage[queryparamname];
    var cssOpenIndex = code.indexOf("<style>");
    var cssCloseIndex = code.indexOf("</style>");
    code = code.substring(0,cssOpenIndex+7) + getCSSContent() + code.substring(cssCloseIndex,code.length);
    console.log(code);
    localStorage.setItem(queryparamname, code);
}

function insertJS () {
    code = localStorage[queryparamname];
    var jsOpenIndex = code.lastIndexOf("<script>");
    var jsCloseIndex = code.lastIndexOf("</script>");
    code = code.substring(0,jsOpenIndex+8) + getJSContent() + code.substring(jsCloseIndex,code.length);
    console.log(code);
    localStorage.setItem(queryparamname, code);
}

editorHTML.getSession().on('change', function () {
    localStorage.setItem(queryparamname, getHTMLContent());
    insertCSS();
    insertJS();
    insertCDN();
    generatePreviewContent();
});

editorCSS.getSession().on('change', function () {
    insertCSS();
    generatePreviewContent();
});

editorJS.getSession().on('change', function () {
    insertJS();
    generatePreviewContent();
});

var getQueryStringValue = function (key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var queryparamname = getQueryStringValue("name");

//document.getElementById("tabname").innerText = queryparamname;
if (typeof localStorage[queryparamname] != "undefined") {
    setHTMLContent(localStorage[queryparamname]);
    generatePreviewContent();
    setTimeout(function () {
        beautifyHTML();
    }, 500);
}


function newPage(){
    var url = "data:text/html;charset=utf-8," + escape(localStorage[queryparamname]);
    var tabOrWindow = window.open(url, '_blank');
    tabOrWindow.focus();
}

function clearCR() {
    location.reload();
}