console.log('Timeseries');

function timeseries(selection){
    var m = {t:20,r:20,b:20,l:20},
        w = selection.node().clientWidth - m.l- m.r,
        h = selection.node().clientHeight - m.t - m.b;

    var arr = selection.datum() || []; //this || [] prevents undefined if someone forgets to bind data. It results in an empty array.

    //define some time ranges
    var t0 = new Date(2011,0,1),
        t1 = new Date(2013,11,31);

    //layout and transform the data
    var histogram = d3.histogram()
        .domain([t0,t1])
        .thresholds(d3.timeDay.range(t0,t1,1)) //this generates an array that jumps by a day at each increment
        .value(function(d){return d.startTime});

    var binDays = histogram(arr);
    //console.log('timeseries: ');
    //console.log(binDays);

    /*  <div>
          <svg>
            <g>
              <path> --> area
              <g> --> y axis
              <path> --> line
              <g> --> x axis
            </g>
          </svg>
        </div> */

    var scaleX = d3.scaleTime().domain([t0,t1]).range([0,w]),
        scaleY = d3.scaleLinear().domain([0,d3.max(binDays,function(d){return d.length})]).range([h,0]);

    var line = d3.line()
        .x(function(d){return scaleX(d.x0)})
        .y(function(d){return scaleY(d.length)});

    var area = d3.area()
        .x(function(d){return scaleX(d.x0)})
        .y1(function(d){return scaleY(d.length)})
        .y0(h);

    var axisX = d3.axisBottom()
  		.scale(scaleX);
  		//.tickValues();

  	var axisY = d3.axisLeft()
  		.scale(scaleY)
  		.ticks()
  		.tickSize(-w);

    // represent - this is where we need to be aware of how many times the function is called (enter, exit, update)
    var svg = selection.selectAll('svg')
        .data([binDays]); //update

    var svgEnter = svg.enter()
        .append('svg'); //enter - as a rule, we should append to the enter set
    svgEnter
        .merge(svg) //enter and update
        .attr('width', w + m.l + m.r)
        .attr('height', h + m.t + m.b);

    var plotEnter = svgEnter.append('g').attr('class','plot')
        .attr('transform','translate(' + m.l + ',' + m.t +')');

    plotEnter.append('path').attr('class','area');
    plotEnter.append('g').attr('class','axis axis-y');
    plotEnter.append('path').attr('class','line');
    plotEnter.append('g').attr('class','axis axis-x');

    var plotUpdate = svg.select('g').merge(plotEnter);
    plotUpdate.select('.area').datum(binDays).attr('d',area);
    plotUpdate.select('.axis-y').call(axisY);
    plotUpdate.select('.line').datum(binDays).attr('d',line);
    plotUpdate.select('.axis-x').call(axisX);


};



/*

  In this example, the data is part of the selection argument. we can get it out by calling selection.datum()
  You can design the function to accecpt two arguments or bind the data to the object
  A selection is not the same as a DOM node. They do not have properties like clientHeight.
  So we have to go back to the DOM node and get the clientWidth/Height

*/
