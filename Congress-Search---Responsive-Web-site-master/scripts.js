var app = angular.module("app", ['angularUtils.directives.dirPagination']);


// Global Variables
var _Ldata="";
var _Bdata="";
var _Cdata = "";
var pwidth=1000;

var larray = new Array();
var barray = new Array();
var carray = new Array();


// Legislator Data
var ldatactrl = function ($scope, $http) {

    hide();
    //$http.get("index.php?type=Legislators")
    $http.get("leg.json")
        .success(function (data) {
        if(data!=null)
        {
            sortByKey(data.results, 'last_name');
        	$scope.json=data.results;
        	$scope.total = data.results.length;
            //$scope.sortState = function($scope){ sortState($scope.json,"chamber")};
        	$scope.getScope = getScope;
        	$scope.fav_l = fav_l;
        	_Ldata = data;
        	$scope.FiletrByLastName = FiletrByLastName;
        	$scope.GetLegDetails = GetLegDetails;
        	$scope.GetState = GetState;
        	$scope.StateChange = function () {
        	}
        	GetLegData();
        }
        });

    if (pwidth > window.innerWidth) {
        Phone_Nav();
    }
}


// Bill Data
var bdatactrl = function ($scope,$http) {
	

    $http.get("index.php?type=Bills&status=active")
    //$http.get("bills.json")
        .success(function (data) {

            if(data!=null)
            {
                $http.get("index.php?type=Bills&status=new")
                .success(function (rsp) {
                    if (rsp.results.length != 0) {

                        $scope.Bdata = data.results.concat(rsp.results);
                    }
                    else {
                        $scope.Bdata = data.results;
                    }

                    $scope.total = data.results.length;
                    _Bdata = data;
                    $scope.GetBillDetails = GetBillDetails;
                    $scope.fav_b = fav_b;
                });

            }
    });
}


// Committees Data
var cdatactrl = function ($scope,$http) {
	

    $http.get("index.php?type=Committees")
   // $http.get("comm.json")
        .success(function (data) {
        if(data!=null)
        {
        	$scope.Cdata=data.results;
        	$scope.total = data.results.length;
        	$scope.fav_c = fav_c;
        	_Cdata = data;
        	$scope.SortBy = "-chamber";
        }
    });
}

// appending the controller to model
app.controller("ldata", ldatactrl);
app.controller("bdata", bdatactrl);
app.controller("cdata", cdatactrl);

function GetLegData()
{
    $("#_mtitle").html("Legislators");
    $("#_dtitle").html("Legislators By State");
    $("#b_search").hide();
    $("#c_search").hide();
    $("#l_state").show();
    $("#_favtable").hide();
    $("#l_search").hide();

    hide();
    $("#_ddetails").show();
    $("#_Ltable").show();

    var sec = document.getElementById("l_state");
    sec.setAttribute("class", "selectpicker");
    
    var dictonaty = {
        "ALL":"All States",
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Colombia",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "VI": "Virgin Islands",
        "WA": "Washington",
        "WV": "West Virgina",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    };


    for (key in dictonaty) {
        var opt = document.createElement("option");
        opt.innerHTML = dictonaty[key];
        opt.value = key;
        sec.appendChild(opt);
    }

    $("#_search").append(sec);
    
    $("#_search").change(function () {
        var $scope = getScope("ldata");
        $scope.json = _Ldata.results;
        if ($("#l_state").val() != "ALL")
            $scope.json = filter_by_state($("#l_state").val(), $scope.json);
        else
            $scope.json = _Ldata.results;
        $scope.$apply();
        $scope.json = _Ldata.results;

    });

    fadecolor();
    document.getElementById("l").style.color = "white";
    
	LegReady();
}

function LegReady()
{
    try {
        $("#_mbuttons").empty();
        var div = document.getElementById("_mbuttons");
        
        var ul = document.createElement("ul");
        ul.setAttribute("class", "nav nav-tabs");
        ul.setAttribute("role", "tablist");
        var li = document.createElement("li");
        li.setAttribute("role", "presentation"); 
        li.setAttribute("class", "active");
        
        var a = document.createElement("a");
        a.setAttribute("aria-controls","home");
        a.setAttribute("role","tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>By State</b>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Legislators By State");
            var $scope = getScope("ldata");
            $scope.json = _Ldata.results;
            sortByKey($scope.json, "state");
            $scope.$apply();


            $("#l_state").val("ALL");
            $("#l_search").hide();
            $("#l_state").show();
        }
        ul.appendChild(li);

        var li = document.createElement("li");
        li.setAttribute("role", "presentation");
        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>House</b>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Legislators By House");
            var $scope = getScope("ldata");
            $scope.json = filter_by_employee_state("house", $scope.json);
            $scope.$apply();
            $scope.json = _Ldata.results;
            $("#l_search").show();
            $("#l_state").hide();
        }
        ul.appendChild(li);

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>Senate</a>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Legislators By Senate");

            // sort + filter
            var $scope = getScope("ldata");
            $scope.json = filter_by_employee_state("senate", $scope.json);
            $scope.$apply();
            $scope.json = _Ldata.results;
            $("#l_search").show();
            $("#l_state").hide();
        }
        ul.appendChild(li);

        div.appendChild(ul);


        /*
        var btn1 = document.createElement("button");
        btn1.setAttribute("class", "btn btn-secondary");
        btn1.innerHTML = "By State";
        btn1.onclick = function ()
        {
            $("#_dtitle").html("Legislators By State");
            var $scope = getScope("ldata");
            $scope.json = _Ldata.results;
            sortByKey($scope.json, "state");
            $scope.$apply();

            
            $("#l_state").val("ALL");
            $("#l_search").hide();
            $("#l_state").show();

        };
        div.appendChild(btn1);

        var btn2 = document.createElement("button");
        btn2.setAttribute("class", "btn btn-secondary");
        btn2.innerHTML = "House";
        btn2.onclick = function () {
            $("#_dtitle").html("Legislators By House");
            var $scope = getScope("ldata");
           $scope.json = filter_by_employee_state("house", $scope.json);
           $scope.$apply();
           $scope.json = _Ldata.results;
           $("#l_search").show();
           $("#l_state").hide();
        };
        div.appendChild(btn2);

        var btn3 = document.createElement("button");
        btn3.setAttribute("class", "btn btn-secondary");
        btn3.innerHTML = "Senate";
        btn3.onclick = function () {
            $("#_dtitle").html("Legislators By Senate");
            
            // sort + filter
            var $scope = getScope("ldata");
            $scope.json = filter_by_employee_state("senate", $scope.json);
            $scope.$apply();
            $scope.json = _Ldata.results;
            $("#l_search").show(); 
            $("#l_state").hide(); 
        };
        div.appendChild(btn3);

        */
        
    } catch (exp) {
        var x = 10;
    }
}

function GetLegDetails(name)
{
    try {

        if (_Ldata != null && _Ldata != "") {
            for (var i = 0; i < _Ldata.results.length; i++) {
                if (name == _Ldata.results[i].last_name + _Ldata.results[i].first_name) {
                    data = _Ldata.results[i];
                    break;
                }
            }

            if (data != "")
            {
                //
                hide();
                $("#_ddetails").hide();
                $("#l_details").show();

                // check if star is in fav - _imgstar
                SetStarSrc(larray, data.title + ". " + data.last_name + ", " + data.first_name, "_imgstarL");
               
                var str = "";
                if (data.party == "R")
                    str = "<img class=\"imgleg\" src=\"r.png\" alt=\"Image\">" + "Republic";
                else
                    str = "<img class=\"imgleg\" src=\"d.png\" alt=\"Image\">" + "Democratic";

                $("#l_r0").html("<img class=\"img200\" src=\"https://theunitedstates.io/images/congress/original/" + data.bioguide_id + ".jpg\"/>");
                $("#l_r1").html(data.title + ". " + data.last_name + ", " + data.first_name);
                $("#l_r2").html(data.oc_email != null ? "<a href=\"mailto:" + data.oc_email + "\">" + data.oc_email + "</a>" : "N.A");
                $("#l_r3").html("Chamber: " + capitalizeFirstLetter(data.chamber));
                $("#l_r4").html("Contact: <a href=\"tel:"+data.phone+"\">" + data.phone+"</a>");
                $("#l_r5").html(str);

                var links = "";
                if (data.hasOwnProperty('twitter_id'))
                    if (data.twitter_id != null)
                        links = "<a href=\"https://www.twitter.com/" + data.twitter_id + "\" target=\"_blank\"><img class=\"imgleg\" src=\"t.png\"></a>";
                if (data.hasOwnProperty('facebook_id'))
                    if (data.facebook_id != null)
                        links += "<a href=\"https://facebook.com./" + data.facebook_id + "\" target=\"_blank\"><img class=\"imgleg\" src=\"f.png\"></a>";

                if (data.hasOwnProperty('website'))
                    if (data.website != null)
                        links += "<a href=\"" + data.website + "\" target=\"_blank\"><img class=\"imgleg\" src=\"w.png\"></a>";

                // date 

                var now = new Date().getTime();
                var term_end = new Date(DateFormat1(data.term_end)).getTime();
                var term_start = new Date(DateFormat1(data.term_start)).getTime();

                var progress = Math.round(((now - term_start) / (term_end - term_start))*100);
                $("#l_c1").html(DateFormat1(data.term_start));
                $("#l_c2").html(DateFormat1(data.term_end));
                var proj = "<div class=\"progress\"><div class=\"progress-bar\" role=\"progressbar\" aria-valuenow="+progress+" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:"+progress+"%\">"+progress+"%</div></div>"

               // $("#l_c3").html("<PROGRESS  value=\"" + progress + "\" max=\"100\"></PROGRESS>");
                $("#l_c3").html(proj);
                $("#l_c4").html(data.office);
                $("#l_c5").html(data.state_name);
                $("#l_c6").html(data.fax == null ? "N.A" : "<a href=\"fax:"+data.fax+"\">"+data.fax+"</a>");
                $("#l_c7").html(data.birthday == null ? "N.A" : DateFormat1(data.birthday));
                $("#l_c8").html(links);

                GetPCDetails(data.bioguide_id);
                GetBCDetails(data.party);
                Phone_Leg_Details();
            }
        }

    } catch (exp) {

    }
}

function GetPCDetails(id) {
    try{
        $.ajax({
            url: "index.php?type=CDetails&bioguid=" + id,
            datatype: "jsonp",
            success: function (data) {
                if (data != null) {
                    $("#pc_details").empty();
                    var _data = JSON.parse(data);
                    for (var i = 0; i < _data.results.length; i++) {
                        if (i == 5)
                            break;
                        var tr = document.createElement("tr");
                        var td = document.createElement("td");
                        td.innerHTML = capitalizeFirstLetter(_data.results[i].chamber);
                        tr.appendChild(td);

                        var td = document.createElement("td");
                        td.innerHTML = _data.results[i].committee_id;
                        tr.appendChild(td);

                        var td = document.createElement("td");
                        td.innerHTML = _data.results[i].name;
                        tr.appendChild(td);

                        $("#pc_details").append(tr);
                    }
                }
            },
            error: function (data) {
                var x = 10;
            }
        });        
    } catch (exp) {

    }
}

function GetBCDetails(id) {
    try{
        $.ajax({
            url: "index.php?type=BDetails&party=" + id,
            datatype: "jsonp",
            success: function (data) {
                if (data != null) {
                    $("#pb_details").empty();
                    var _data = JSON.parse(data);
                    for (var i = 0; i < _data.results.length; i++) {
                        if (i == 5)
                            break;
                        var tr = document.createElement("tr");
                        var td = document.createElement("td");
                        td.innerHTML = _data.results[i].bill_id.toUpperCase();
                        tr.appendChild(td);

                        var td = document.createElement("td");
                        td.innerHTML = _data.results[i].official_title;
                        tr.appendChild(td);

                        var td = document.createElement("td");
                        td.innerHTML = capitalizeFirstLetter(_data.results[i].chamber);
                        tr.appendChild(td);

                        var td = document.createElement("td");
                        td.innerHTML = _data.results[i].bill_type.toUpperCase();
                        tr.appendChild(td);

                        var td = document.createElement("td");
                        td.innerHTML = _data.results[i].congress;
                        tr.appendChild(td);

                        /*var td = document.createElement("td");
                        td.innerHTML = "<a href=\"" + _data.results[i].last_version.urls.pdf + "\" target=\"_blank\" >Link</a>";
                        tr.appendChild(td);*/

                        $("#pb_details").append(tr);
                    }
                }
            },
            error: function (data) {

            }
        });
    } catch (exp) {

    }
}



function GetBillData()
{
    try{
        $("#_mtitle").html("Bills");
        $("#_dtitle").html("Active Bills");
        $("#b_search").show();
        $("#c_search").hide();
        $("#l_state").hide();
        $("#_favtable").hide();
        $("#l_search").hide();


        hide();
        $("#_ddetails").show();
        $("#_Btable").show();
        $("#b_details").hide();

      
        BillsReady();

        fadecolor();
        document.getElementById("b").style.color = "white";
    } catch (exp) {
        var x = 10;
    }
}

function BillsReady()
{
    try {
        $("#_mbuttons").empty();
        var div = document.getElementById("_mbuttons");

        var ul = document.createElement("ul");
        ul.setAttribute("class", "nav nav-tabs");
        ul.setAttribute("role", "tablist");

        var li = document.createElement("li");
        li.setAttribute("role", "presentation");
        li.setAttribute("class", "active");

        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>Active Bills</b>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Active Bills");

            var $scope = getScope("bdata");
            $scope.Bdata = filter_by_employee_state("true", $scope.Bdata);
            $scope.$apply();
            $scope.Bdata = _Bdata.results;

        }
        ul.appendChild(li);

        var li = document.createElement("li");
        li.setAttribute("role", "presentation");
        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>New Bills</b>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("New Bills");

            var $scope = getScope("bdata");
            $scope.Bdata = filter_by_employee_state("false", $scope.Bdata);
            $scope.$apply();
            $scope.Bdata = _Bdata.results;
        }
        
        ul.appendChild(li);

        div.appendChild(ul);


        /*
        var btn1 = document.createElement("button");
        btn1.setAttribute("class", "btn btn-secondary");
        btn1.innerHTML = "Active Bills";
        btn1.onclick = function () {
            $("#_dtitle").html("Active Bills");
        };
        div.appendChild(btn1);

        var btn2 = document.createElement("button");
        btn2.setAttribute("class", "btn btn-secondary");
        btn2.innerHTML = "New Bills";
        btn2.onclick = function () { $("#_dtitle").html("New Bills"); };
        div.appendChild(btn2);

        */
    } catch (exp) {

    }
}

function GetBillDetails(id)
{
    try {
        var data = "";
        if (_Bdata != "") {
            for (var i = 0; i < _Bdata.results.length; i++)
                if (_Bdata.results[i].bill_id == id)
                    data = _Bdata.results[i];
        }

        if (data != "") {
            $("#_ddetails").hide();
            $("#b_details").show();

            $("#b_id").html(data.bill_id.toUpperCase());
            $("#b_pdfviewer").html("<iframe class=\"pdf\" src=\"http://docs.google.com/gview?url=" + data.last_version.urls.pdf + "&embedded=true\" frameborder=\"0\"></iframe>");
            $("#b_title").html(data.official_title);
            $("#b_type").html(data.bill_type.toUpperCase());
            $("#b_sponsor").html(data.sponsor.title + ". " + data.sponsor.last_name + " " + data.sponsor.last_name);
            $("#b_chamber").html(capitalizeFirstLetter(data.chamber));
            $("#b_status").html(data.history.active?"Active":"New");
            $("#b_introducedon").html(DateFormat1(data.introduced_on));
            $("#b_congress").html("<a href=\"" + data.urls.congress + "\" target=\"_blank\">URL</a>");
            $("#b_version").html(data.last_version.version_name);
            $("#b_billurl").html("<a href=\"" + data.last_version.urls.pdf + "\" target=\"_blank\">Link</a>");


            SetStarSrc(barray, data.official_title, "_imgstar");

        }

        if(pwidth>window.innerWidth)
        Phone_Bill_details();
    } catch (exp) {

    }
}



function GetCommitteeData()
{
    $("#_mtitle").html("Committees");
    $("#_dtitle").html("House");
    $("#b_search").hide();
    $("#c_search").show();
    $("#l_state").hide();
    $("#_favtable").hide();
    hide();
    $("#_ddetails").show();
    $("#_Ctable").show();
    $("#l_search").hide();

    CommitteessReady();

    fadecolor();
    document.getElementById("c").style.color = "white";
}

function CommitteessReady()
{
    try{
        $("#_mbuttons").empty();
        
        // Buttons
        var div = document.getElementById("_mbuttons");

        var div = document.getElementById("_mbuttons");

        var ul = document.createElement("ul");
        ul.setAttribute("class", "nav nav-tabs");
        ul.setAttribute("role", "tablist");

        var li = document.createElement("li");
        li.setAttribute("role", "presentation");
        li.setAttribute("class", "active");

        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>House</b>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("House");

            var $scope = getScope("cdata");
            $scope.Cdata = filter_by_employee_state("house", $scope.Cdata);
            $scope.$apply();
            $scope.Cdata = _Cdata.results;
        }
        ul.appendChild(li);

        var li = document.createElement("li");
        li.setAttribute("role", "presentation");
        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<a>Senate</a>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Senate");

            var $scope = getScope("cdata");
            $scope.Cdata = filter_by_employee_state("senate", $scope.Cdata);
            $scope.$apply();
            $scope.Cdata = _Cdata.results;
        }
        ul.appendChild(li);

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>Joint</a>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Joint");

            var $scope = getScope("cdata");
            $scope.Cdata = filter_by_employee_state("joint", $scope.Cdata);
            $scope.$apply();
            $scope.Cdata = _Cdata.results;
        }
        ul.appendChild(li);

        div.appendChild(ul);

        /*
        var btn1 = document.createElement("button");
        btn1.setAttribute("class", "btn btn-secondary");
        btn1.innerHTML = "House";
        btn1.onclick = function () {
            $("#_dtitle").html("House");

            var $scope = getScope("cdata");
            $scope.Cdata = filter_by_employee_state("house", $scope.Cdata);
            $scope.$apply();
            $scope.Cdata = _Cdata.results;
        };
        div.appendChild(btn1);

        var btn2 = document.createElement("button");
        btn2.setAttribute("class", "btn btn-secondary");
        btn2.innerHTML = "Senate";
        btn2.onclick = function () {
            $("#_dtitle").html("Senate");

            var $scope = getScope("cdata");
            $scope.Cdata = filter_by_employee_state("senate", $scope.Cdata);
            $scope.$apply();
            $scope.Cdata = _Cdata.results;
        };
        div.appendChild(btn2);

        var btn3 = document.createElement("button");
        btn3.setAttribute("class", "btn btn-secondary");
        btn3.innerHTML = "Joint";
        btn3.onclick = function () {
            $("#_dtitle").html("Joint");

            var $scope = getScope("cdata");
            $scope.Cdata = filter_by_employee_state("joint", $scope.Cdata);
            $scope.$apply();
            $scope.Cdata = _Cdata.results;
        };
        div.appendChild(btn3);
        */
        var _temp = _Cdata;
        
    } catch (exp) {

    }
}


function GetFav()
{
    $("#_mtitle").html("Favourites");
    $("#_dtitle").html("Favourite Legislators");
    $("#b_search").hide();
    $("#c_search").hide();
    $("#l_state").hide();
    $("#_favtable").show();
    hide();
    $("#_ddetails").show();

    // Adding buttons

    try {
        $("#_mbuttons").empty();

        var div = document.getElementById("_mbuttons");

        var div = document.getElementById("_mbuttons");

        var ul = document.createElement("ul");
        ul.setAttribute("class", "nav nav-tabs");
        ul.setAttribute("role", "tablist");

        var li = document.createElement("li");
        li.setAttribute("role", "presentation");
        li.setAttribute("class", "active");

        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>Legislators</b>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Favourite Legislators");
            AppendLegData();
        }
        ul.appendChild(li);

        var li = document.createElement("li");
        li.setAttribute("role", "presentation");
        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>Bills</b>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Favourite Bills");
            AppendBillData();
        }
        ul.appendChild(li);

        var li = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("aria-controls", "home");
        a.setAttribute("role", "tab");
        a.setAttribute("data-toggle", "tab");
        a.setAttribute("class", "nostyleul");
        a.innerHTML = "<b>Committees</a>";
        li.appendChild(a);
        li.onclick = function () {
            $("#_dtitle").html("Favourite Committees");
            AppendCommitteeData();
        }
        ul.appendChild(li);

        div.appendChild(ul);

        /*

        var div = document.getElementById("_mbuttons");

        // Buttons


        var btn1 = document.createElement("button");
        btn1.setAttribute("class", "btn btn-secondary");
        btn1.innerHTML = "Legislators";
        btn1.onclick = function () { $("#_dtitle").html("Favourite Legislators"); AppendLegData();};
        div.appendChild(btn1);

        var btn2 = document.createElement("button");
        btn2.setAttribute("class", "btn btn-secondary");
        btn2.innerHTML = "Bills";
        btn2.onclick = function () { $("#_dtitle").html("Favourite Bills"); AppendBillData();};
        div.appendChild(btn2);

        var btn3 = document.createElement("button");
        btn3.setAttribute("class", "btn btn-secondary");
        btn3.innerHTML = "Committees";
        btn3.onclick = function () { $("#_dtitle").html("Favourite Committees"); AppendCommitteeData();};
        div.appendChild(btn3);

        */

        // calling 
        AppendLegData();

    } catch (exp) {

    }

    fadecolor();
    document.getElementById("f").style.color = "white";
}

function fav_l(event) {
    if (larray.indexOf($("#l_r1").html().trim()) == -1) {
        larray.push($("#l_r1").html().trim());
        event.target.src = "Y.png";
    }
}

function fav_ll(name) {
    if (larray.indexOf(name.trim()) != -1) {
        larray.splice(larray.indexOf(name.trim()), 1);
        AppendLegData();
    }
}

function AppendLegData() {
    try {
        $("#_favtable").empty();
        if (larray.length > 0) {
            
            var table = document.createElement("table");
            table.setAttribute("class", "table table-responsive table-hover");

            var thead = document.createElement("thead");
            thead.innerHTML = "<tr><th></th><th>Image</th><th>Party</th><th>Name</th><th>Chamber</th><th>State</th><th>Email</th><th></th></tr>";
            table.appendChild(thead);


            for (var i = 0; i < larray.length; i++) {
                var temp = "";
                for (var j = 0; j < _Ldata.results.length; j++) {
                    temp = _Ldata.results[j];  //  data.title + ". " + data.last_name + ", " + data.first_name
                    if (larray[i] == (temp.title + ". " + temp.last_name + ", " + temp.first_name)) {
                        break;
                    }
                }
                var tr = document.createElement("tr");

                var td = document.createElement("td");
                td.innerHTML = "<center><a href=\"javascript:fav_ll('" + temp.title + ". " + temp.last_name + ", " + temp.first_name + "');\"><img class=\"delimg\" src=\"del.png\" /></a></center>";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = "<center><img class=\"limg\" src=\"https://theunitedstates.io/images/congress/original/" + temp.bioguide_id + ".jpg\"/></center>";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.party == "R" ? "<img class=\"limg\" src=\"r.png\" />" : "<img class=\"limg\" src=\"d.png\" />";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.last_name+","+temp.first_name;
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML =  temp.chamber=="house"?"<img class=\"limg\" src=\"h.png\" />House":"<img class=\"limg\" src=\"s.svg\" />Senate";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = GetState(temp.state);
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.oc_email != null ? "<a href=\"mailto:" + temp.oc_email + "\">" + temp.oc_email + "</a>" : "N.A";
                tr.appendChild(td);

                var td = document.createElement("td");
                var btn = document.createElement("input");
                btn.setAttribute("type", "button");
                btn.setAttribute("class", "btn btn-primary");
                btn.setAttribute("value", "View Details");
                btn.onclick = function () { GetLegDetails(temp.last_name + temp.first_name) };
                td.appendChild(btn);
                tr.appendChild(td);
                
                table.appendChild(tr);
            }

            $("#_favtable").append(table);
        }
    } catch (exp) {
        var x = 10;
    }
}


function fav_b(event)
{
    if (barray.indexOf($("#b_title").html().trim()) == -1) {
        barray.push($("#b_title").html().trim());
        event.target.src = "Y.png";
    }
}

function fav_bl(title)
{
    if (barray.indexOf(title.trim()) != -1) {
        barray.splice(barray.indexOf(title.trim()), 1);
        AppendBillData();
    }
}

function AppendBillData()
{
    try {
        $("#_favtable").empty();
        if (barray.length > 0) {
            
            var table = document.createElement("table");
            table.setAttribute("class", "table table-responsive table-hover");

            var thead = document.createElement("thead");
            thead.innerHTML = "<tr><th></th><th>Bill ID</th><th>Bill Type</th><th>Title</th><th>Chamber</th><th>Introduced On</th><th>Sponsor</th><th></th></tr>";
            table.appendChild(thead);


            for (var i = 0; i < barray.length; i++) {
                var temp = "";
                for (var j = 0; j < _Bdata.results.length; j++) {
                    temp = _Bdata.results[j];  
                    if (barray[i] == temp.official_title) {
                        break;
                    }
                }
                var tr = document.createElement("tr");

                var td = document.createElement("td");
                td.innerHTML = "<center><a href=\"javascript:fav_bl('" + temp.official_title + "');\"><img class=\"delimg\" src=\"del.png\" /></a></center>";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.bill_id.toUpperCase();
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.bill_type.toUpperCase();
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.official_title;
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.chamber == "house" ? "<img class=\"limg\" src=\"h.png\" />House" : "<img class=\"limg\" src=\"s.svg\" />House";;
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.introduced_on;
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.sponsor.title + "." + temp.sponsor.last_name + "," + temp.sponsor.first_name;
                tr.appendChild(td);

                var td = document.createElement("td");
                var btn = document.createElement("input");
                btn.setAttribute("type", "button");
                btn.setAttribute("class", "btn btn-primary");
                btn.setAttribute("value", "View Details");
                btn.onclick = function () { GetLegDetails(temp.last_name + temp.first_name) };
                td.appendChild(btn);
                tr.appendChild(td);

                table.appendChild(tr);

            }

            $("#_favtable").append(table);

            
        }
    } catch (exp) {
        var x = 10;
    }
}


function fav_c(id) {
    if (carray.indexOf(id.trim())==-1) {
        carray.push(id);
        document.getElementById(id).src="Y.png";
    }
}

function fav_cl(id)
{
    if (carray.indexOf(id.trim()) != -1) {
        carray.splice(carray.indexOf(id.trim()), 1);
        document.getElementById(id).src = "B.png";
        AppendCommitteeData();
    }
}

function AppendCommitteeData()
{
    try {

        $("#_favtable").empty();

        if (carray.length > 0) {
            var table = document.createElement("table");
            table.setAttribute("class", "table table-responsive table-hover");

            var thead = document.createElement("thead");
            thead.innerHTML = "<tr><th></th><th>Chamber</th><th>Committee ID</th><th>Name</th><th>Parent Committee</th><th>Sub Committee</th></tr>";
            table.appendChild(thead);


            for (var i = 0; i < carray.length; i++) {
                var temp = "";
                for (var j = 0; j < _Cdata.results.length; j++) {
                    temp = _Cdata.results[j];
                    if (carray[i] == temp.committee_id) {
                        break;
                    }
                }
                var tr = document.createElement("tr");

                var td = document.createElement("td");
                td.innerHTML = "<center><a href=\"javascript:fav_cl('" + temp.committee_id + "');\"><img class=\"delimg\" src=\"del.png\" /></a></center>";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.chamber == "house" ? "<img class=\"limg\" src=\"h.png\" />House" : "<img class=\"limg\" src=\"s.svg\" />House";
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.committee_id;
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.name == null ? "NA" : temp.name;
                tr.appendChild(td);

                var td = document.createElement("td");
                td.innerHTML = temp.parent_committee_id == null ? "NA" : temp.parent_committee_id;
                tr.appendChild(td);  // subcommittee

                var td = document.createElement("td");
                td.innerHTML = temp.subcommittee == null ? "NA" : temp.subcommittee;
                tr.appendChild(td);

                table.appendChild(tr);
            }

            $("#_favtable").append(table);
        }
    } catch (exp) {
        var x = 10;
    }
}



var flag = false;
function hideNavBar()
{
    if (!flag) {
        $("#_navbar").hide();
        $("#col_10").addClass("col-xs-12");
        $("#col_10").removeClass("col-xs-10");

    } else {
        $("#_navbar").show();
        $("#col_10").removeClass("col-xs-12");
        $("#col_10").addClass("col-xs-10");
    }

    flag = !flag;
}

function hide()
{
    try {
        $("#_ddetails").hide();
        // Ltable
        $("#_Ltable").hide();
        $("#l_details").hide();
        // Ldetail table
        // Btable
        $("#_Btable").hide();
        // Bdetail table
        $("#b_details").hide();
        //committee
        $("#_Ctable").hide();
    }catch(exp){

    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function GetState(key) {
    if (key == "" || key == null)
        return "";
    var dictonaty = {
        "ALL":"All States",
        "AL": "Alabama",
        "AK": "Alaska",
        "AS": "American Samoa",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District of Colombia",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "VI": "Virgin Islands",
        "WA": "Washington",
        "WV": "West Virgina",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    };

    return dictonaty[key] != undefined ? dictonaty[key] : key;
}



// ***** Utilities

function SetStarSrc(arr,value, id)
{
    for(var x in arr)
    {
        if (arr[x] == value)
        {
            document.getElementById(id).src = "Y.png";
            return; 
        }
    }

    document.getElementById(id).src = "B.png";
}

// Sorting
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function FiletrByLastName() {
    try{
        var $scope = getScope("ldata");
        $scope.json = filter_by_last_name(_Ldata.results, document.getElementById("l_search").value);
        $scope.$apply();
        $scope.json = _Ldata.results;
    } catch (exp) {

    }
}
// Filter 
function filter_by_employee_state(query, obj)
    {
        var new_obj = new Array(), query = query.toLowerCase();
        var j=0;
        for(var i in obj)
        {
            var emp_st=obj[i].chamber.toLowerCase();
            if (emp_st == query)
            {
                new_obj[j++] = obj[i];
            }
        }
        return new_obj;
    }

function filter_by_state(query, obj) {
    var new_obj = new Array(), query = query.toLowerCase();
    var j = 0;
    for (var i in obj) {
        var emp_st = obj[i].state.toLowerCase();
        if (emp_st == query) {
            new_obj[j++] = obj[i];
        }
    }
    return new_obj;
}

function filter_by_status(query, obj) {
    var new_obj = new Array(), query = query.toLowerCase();
    var j = 0;
    for (var i in obj) {
        var emp_st = obj[i].history.active.toLowerCase();
        if (emp_st == query) {
            new_obj[j++] = obj[i];
        }
    }
    return new_obj;
}

function filter_by_last_name(query, obj) {
    var new_obj = new Array(), query = query.toLowerCase();
    var j = 0;
    for (var i in obj) {
        var emp_st = obj[i].last_name.toLowerCase();
        if (emp_st.includes(query)) {
            new_obj[j++] = obj[i];
        }
    }
    return new_obj;
}

function fadecolor()
{
    document.getElementById("l").style.color = "darkgray";
    document.getElementById("b").style.color = "darkgray";
    document.getElementById("c").style.color = "darkgray";
    document.getElementById("f").style.color = "darkgray";
}                                             

function DateFormat1(date)
{
    var date1 = new Date(date);
    var options = {
        year: "numeric", month: "short",
        day: "numeric"
    };

    return date1.toLocaleDateString("en-US", options);
}

function getScope(ctrlName) {
    var sel = 'div[ng-controller="' + ctrlName + '"]';
    return angular.element(sel).scope();
}


/*  Phone window*/
window.onresize = function () {
    if (pwidth >= window.innerWidth) {
        document.getElementById("Leg_1").setAttribute("class", "col-sm-12");
        document.getElementById("Leg_2").setAttribute("class", "col-sm-12");


        document.getElementById("_bill_seg1").setAttribute("class", "col-sm-12");
        document.getElementById("_bill_seg2").setAttribute("class", "col-sm-12");


    } else {
        document.getElementById("Leg_1").setAttribute("class", "col-xs-6");
        document.getElementById("Leg_2").setAttribute("class", "col-xs-6");

        document.getElementById("_bill_seg1").setAttribute("class", "col-xs-6");
        document.getElementById("_bill_seg2").setAttribute("class", "col-xs-6");
    }
}

function Phone_Leg_Details(){
   
}

function Phone_Bill_details() {
    
}

function Phone_Nav()
{
    // Navigation bar
    document.getElementById("nav_l").style.display = "none";
    document.getElementById("nav_b").style.display = "none";
    document.getElementById("nav_c").style.display = "none";
    document.getElementById("nav_f").style.display = "none";

    document.getElementById("_navbar").removeAttribute("class", "col-xs-2");
    document.getElementById("_navbar").setAttribute("class", "col-xs-1"); //col_10


    document.getElementById("col_10").setAttribute("class", "col-xs-10"); //
    document.getElementById("col_10").setAttribute("class", "col-xs-11"); //
}








         
    