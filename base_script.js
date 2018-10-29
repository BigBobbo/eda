var gradeDict = crossfilter([{'grade': 'AA1',
  'name': 'Leahy, \xc3\x81ine',
  'natScore': 4,
  'order': 1,
  'subject': 'Irish'},
 {'grade': 'AA1',
  'name': 'Leahy, \xc3\x81ine',
  'natScore': 4,
  'order': 1,
  'subject': 'English'},
 {'grade': 'AA1',
  'name': 'Leahy, \xc3\x81ine',
  'natScore': 6,
  'order': 1,
  'subject': 'Maths'},
 {'grade': 'AA1',
  'name': 'Moloney, Tim',
  'natScore': 2,
  'order': 1,
  'subject': 'Irish'},
 {'grade': 'AC1',
  'name': 'Moloney, Tim',
  'natScore': 2,
  'order': 6,
  'subject': 'English'},
 {'grade': 'AA2',
  'name': 'Moloney, Tim',
  'natScore': 6,
  'order': 2,
  'subject': 'Maths'},
 {'grade': 'AA1',
  'name': 'Murphy, Ciara',
  'natScore': 4,
  'order': 1,
  'subject': 'Irish'},
 {'grade': 'AA1',
  'name': 'Murphy, Ciara',
  'natScore': 1,
  'order': 1,
  'subject': 'English'},
 {'grade': 'AA2',
  'name': 'Murphy, Ciara',
  'natScore': 2,
  'order': 2,
  'subject': 'Maths'},
 {'grade': 'GB1',
  'name': 'Blake, Cormac',
  'natScore': 4,
  'order': 14,
  'subject': 'Irish'},
 {'grade': 'AC1',
  'name': 'Blake, Cormac',
  'natScore': 3,
  'order': 6,
  'subject': 'English'},
 {'grade': 'AA1',
  'name': 'Blake, Cormac',
  'natScore': 6,
  'order': 1,
  'subject': 'Maths'},
 {'grade': 'AA1',
  'name': 'Dowling, Bonnie',
  'natScore': 1,
  'order': 1,
  'subject': 'Irish'},
 {'grade': 'AA2',
  'name': 'Dowling, Bonnie',
  'natScore': 5,
  'order': 2,
  'subject': 'English'},
 {'grade': 'GA1',
  'name': 'Dowling, Bonnie',
  'natScore': 6,
  'order': 12,
  'subject': 'Maths'},
 {'grade': 'AA1',
  'name': 'Dowling, Bonnie',
  'natScore': 5,
  'order': 1,
  'subject': 'History'}])



var ranking = {
     "AA1":1,
    "AA2":2,
    "AB1":3,
    "AB2":4,
    "AB3":5,
    "AC1":6,
    "AC2":7,
    "AC3":8,
    "AD1":9,
    "AD2":10,
    "AD3":11,
    "AE" :12,
    "GA1":13,
    "GA2":14,
    "GB1":15,
    "GB2":16,
    "GB3":17,
    "GC1":18,
    "GC2":19,
    "GC3":20,
    "GD1":21,
    "GD2":22,
    "GD3":23,
    "GE" :24,
    "BA1":25,
    "BA2":26,
    "BB1":27,
    "BB2":28,
    "BB3":29,
    "BC1":30,
    "BC2":31,
    "BC3":32,
    "BD1":33,
    "BD2":34,
    "BD3":35,
}

var dimensionGrade = gradeDict.dimension(student_grade => student_grade.grade)
var countByGrade = dimensionGrade.group().reduceCount()
console.log(countByGrade.all())
var natAvg = dimensionGrade.group()
var reducer = reductio()
    .count(true)
    .sum(function(d) { return d.natScore; })
    .avg(true);
reducer(natAvg)


let dimensionSubject = gradeDict.dimension(student_grade => student_grade.subject)
let countBySubject = dimensionSubject.group().reduceCount()



console.log(countBySubject)

var fudge = 40;


var chart1 = dc.barChart("#chart");
chart1
.width(window.innerWidth*3/4 - fudge)
.height(window.innerHeight*2/3 - fudge)
    // .useViewBoxResizing(true)
    .margins({top: 30, right: 50, bottom: 25, left: 40})
    .x(d3.scaleOrdinal())
    .ordinalColors(['#51abc1','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'])
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Country")
   	.yAxisLabel("Out of date quantity")
    .elasticY(true)
    .dimension(dimensionGrade)
    .group(countByGrade)
    .ordering(function(d) { return -ranking[d.key]; });
    // apply_resizing(chart1, 20);
chart1.render();


var pie1 = dc.pieChart("#pie1");
pie1
    .width(200)
    .height(200)
    .innerRadius(25)
    .label(function(d) {
				return d.key + ': ' + d.value;
		})
    .dimension(dimensionSubject)
    .group(countBySubject);
pie1.render();


var composite = dc.compositeChart("#test_composed");
 composite
        .width(window.innerWidth*3/4 - fudge)
        .height(window.innerHeight*2/3 - fudge)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .yAxisLabel("The Y Axis")
        .group(countByGrade)
        ._rangeBandPadding(1)
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .ordering(function(d) { return -ranking[d.key]; })
        .renderHorizontalGridLines(true)
        .compose([
						dc.barChart(composite)
                .dimension(dimensionGrade)
                .colors('#87a8dd')
                .centerBar(true)
                .gap(5)
                .group(natAvg, "Bottom Line")
                .valueAccessor(function (p) {return p.value.sum;
        }),
        dc.lineChart(composite)
            .dimension(dimensionGrade)
            .colors('red')
            .group(countByGrade, "Top Line")
            .dashStyle([2,2])
            ]);

composite.render();

window.onresize = function() {
    chart1
        .width(window.innerWidth*3/4 - fudge)
        .height(window.innerHeight*2/3 - fudge)
        .rescale();

    composite
    .width(window.innerWidth*3/4 - fudge)
    .height(window.innerHeight*2/3 - fudge)
        .rescale();

    dc.redrawAll();
};

categoryChart = dc.rowChart("#chart-category");

categorySubject = dimensionSubject.group();

categoryChart //rowChart
      .width(200).height(100)
      .dimension(dimensionSubject) 
      .colors(['#F74427'])         
      .group(categorySubject)
      .valueAccessor(function(d) {
        return 50; //fixed size to make a square checkbox
      })
      .title(function(d) { return d.key; })
      .renderlet(function (chart) {
        chart.selectAll("g").selectAll("row _0").attr("transform", "translate(38, 0)");
        chart.selectAll("g").selectAll("row _1").attr("transform", "translate(-38, 0)");
      });

categoryChart.xAxis().tickFormat(function(v) { return ""; });    

categoryChart.render()


console.log(natAvg.all())
console.log(countByGrade.all())