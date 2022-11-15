//console.log(d3)
let req= new XMLHttpRequest()

let values=[]

let xscale
let yscale

let width= 800
let height= 600
let padding= 40

let svg= d3.select('svg')
let tooltip= d3.select('#tooltip')
let symbol = d3.symbol();

let drawCanvas = () => {
    svg.attr('width',width)
    svg.attr('height',height)
}

let generateScales = () => {
    xscale= d3.scaleLinear()
        
        .domain([d3.min(values, (item) => {
            return item['Weight']
        })-500,d3.max(values, (item)=> {
            return item['Weight']
        })])
        .range([padding,width -padding])
    
    yscale= d3.scaleLinear()
        .domain([d3.max(values, (item) => {
            return item['Len']
        }),d3.min(values, (item)=> {
            return item['Len']
        })-10])
        .range([padding,height -padding])
}

let drawPoints = () => {
    svg.selectAll('.dot')
        .data(values)
        .enter()
        .append('path')
       // .attr('class','circle')
        //.attr('stroke','#000')
        //.attr('stroke-width',1)
        .attr("d", symbol.type((item)=> {
            if (item['Cyl'] == '4'){
                return d3.symbolSquare
            }
            else  if(item['Cyl'] == '6'){
                return d3.symbolDiamond
            }
            else  if(item['Cyl'] == '8'){
                return d3.symbolCross
            } 
            else {
                return d3.symbolStar
            } 
        }) )

        .attr('transform',function(d){ return "translate("+xscale(d.Weight)+","+yscale(d.Len)+")"; })
        .attr('r','5')
        .attr('data-xvalue',(item)=>{
            return item['Weight']
        })
        .attr('data-yvalue',(item)=>{
            return item['Len']
        })
        .attr('cx', (item)=> {
            return xscale(item['Weight'])
        })
        .attr('cy', (item)=> {
            return yscale(item['Len'])
        })
       .attr('fill',(item)=> {
            if(item['Type'] == 'Sedan'){
                return 'green'
            }
            else if(item['Type'] == 'SUV'){
                return 'blue'
            }
            else if(item['Type'] == 'Minivan'){
                return 'yellow'
            }
            else if(item['Type'] == 'Wagon'){
                return 'orange'
            }
            else {
                return 'red'
            }
        })
        .on('click', (item) => {
            tooltip.transition()
                .style('visibility','visible')
            tooltip.text(item['Name'])
        })

}

let generateAxes = () => {
    let xAxis= d3.axisBottom(xscale)
                    .tickFormat(d3.format('d'))
    let yAxis= d3.axisLeft(yscale)
                    .tickFormat(d3.format('d'))
    svg.append('g')
        .call(xAxis)
        .attr('id','x-axis')
        .attr('transform','translate(0,'+(height-padding)+')')
    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr('transform','translate('+padding+',0)')

}

// req.open('GET', url, true)
// req.onload= () => {
   // console.log(req.responseText)
  // values= JSON.parse(req.responseText)

    d3.csv("./cardata.csv").then(function(data) {
        values=data
        console.log(values)
        drawCanvas()
        generateScales()
        drawPoints()
        generateAxes() 
     
   });

   
// }
// req.send()