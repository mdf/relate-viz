var remote_pollingRate = 5000;
var remote_username = 'username';
var remote_password = 'password';

var remote_service = new rpc.ServiceProxy("/relatedev/xmlrpc.php", {
	asynchronous: true,
	sanitize: true,
	methods: ['shadowpress.mdf'],
	protocol: 'XML-RPC',
});


function RelateChart(dataType, dbId, min, max, colour, tagName)
{
	this.w = 20;
	this.h = 80;
	this.tagName = tagName;	

	this.dataType = dataType;
	this.dbId = dbId;
	this.min = min;
	this.max = max;
	this.colour = colour;
	
	this.data = new Array();
	this.dataSize = 30;


	this.timescale = d3.scale.linear()
		.domain([0, 1])
		.range([0, this.w]);

	this.datascale = d3.scale.linear()
		.domain([min, max])
		.rangeRound([0, this.h]);

	this.chart = d3.select("body").selectAll(tagName).append("svg")
		.attr("class", "chart")
		.attr("width", this.w * this.dataSize - 1)
		.attr("height", this.h);
};

RelateChart.prototype.addData = function(timestamp, value)
{
	var reading = {};
	reading["timestamp"] = timestamp;
	reading["value"] = value;

	this.data.push(reading);

	if(this.data.length>this.dataSize)
	{
		this.data.shift();
	}
};

RelateChart.prototype.redraw = function()
{
	//console.log("redraw " + this.dataType);
	//console.log(data);

	var _this = this;

	var rect = _this.chart.selectAll("rect")
		.data(this.data, function(d) { return d.timestamp; });

	rect.enter().insert("rect", "line")
		.style("fill", _this.colour)
		.attr("x", function(d, i) { return _this.timescale(i + 1) - .5; })
		.attr("y", function(d) { return _this.h - _this.datascale(d.value) - .5; })
		.attr("width", _this.w)
   		.attr("height", function(d) { return _this.datascale(d.value); })
 		.transition()
   		.duration(1000)
   		.attr("x", function(d, i) { return _this.timescale(i) - .5; });

	rect.transition()
		.duration(1000)
		.attr("x", function(d, i) { return _this.timescale(i) - .5; });

	rect.exit().transition()
		.duration(1000)
		.attr("x", function(d, i) { return _this.timescale(i - 1) - .5; })
		.remove();

};


function RelateDevice(deviceId, dataTypes)
{
	this.deviceId = deviceId;
	this.dataTypes = dataTypes;
/*
	this.dataTypes = {};

	this.dataTypes["1"] = new RelateChart("temperature", "1", 0, 30, "red");
	this.dataTypes["4"] = new RelateChart("humidity", "4", 0, 100, "grey");
	this.dataTypes["5"] = new RelateChart("rain", "9", 0, 1000, "blue");*/

	this.doAsync(30);
};

RelateDevice.prototype.onError = function(errorObj)
{
	console.log("on error");
	console.log(errorObj);	
};
	
RelateDevice.prototype.onComplete = function()
{
	//console.log("on complete");	
};
	
RelateDevice.prototype.onSuccess = function(message)
{
	for(property in message)
	{
		var readingset = message[property];
		// TODO check if data is old

		for (var i in this.dataTypes)
		{
			var val = readingset[this.dataTypes[i].dbId];
			if(val==undefined)
				val = 0;

			this.dataTypes[i].addData(readingset["timestamp"], val);
		}
	}

	for (var i in this.dataTypes)
	{
		this.dataTypes[i].redraw();
	}
};		
	
RelateDevice.prototype.doAsync = function(count)
{
	var _this = this;
	setTimeout(function(){setupAsync(_this, 1)}, remote_pollingRate);
	remote_service.shadowpress.mdf({
		params:  [remote_username, remote_password, _this.deviceId, count],
			onSuccess:function(successObj){onSuccessCallback(_this, successObj)},
			onException:function(errorObj){onErrorCallback(_this, errorObj)},
			onComplete:function(){onCompleteCallback(_this)}
	});
};

function onSuccessCallback(relateDevice, successObj)
{
	relateDevice.onSuccess(successObj);	
}

function onErrorCallback(relateDevice, errorObj)
{
	relateDevice.onError(errorObj);	
}

function onCompleteCallback(relateDevice)
{
	relateDevice.onComplete();	
}
			
function setupAsync(relateDevice, count)
{
	relateDevice.doAsync(count);	
};

