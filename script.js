document.addEventListener("DOMContentLoaded", function () {
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const svg = d3
      .select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    ).then(function (data) {
      const dataset = data.data;
  
      const xScale = d3
        .scaleTime()
        .domain([
          d3.min(dataset, (d) => new Date(d[0])),
          d3.max(dataset, (d) => new Date(d[0])),
        ])
        .range([0, width]);
  
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([height, 0]);
  
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
  
      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  
      svg.append("g").attr("id", "y-axis").call(yAxis);
  
      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(new Date(d[0])))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", width / dataset.length)
        .attr("height", (d) => height - yScale(d[1]))
        .attr("class", "bar")
        .on("mouseover", function (d) {
          d3.select(this).attr("class", "bar active");
          const tooltip = document.getElementById("tooltip");
          tooltip.style.opacity = 0.9;
          tooltip.style.left = xScale(new Date(d[0])) + 10 + "px";
          tooltip.style.top = yScale(d[1]) - 40 + "px";
          tooltip.setAttribute("data-date", d[0]);
          tooltip.textContent = d[0] + "\n$" + d[1] + " Billion";
        })
        .on("mouseout", function () {
          d3.select(this).attr("class", "bar");
          const tooltip = document.getElementById("tooltip");
          tooltip.style.opacity = 0;
        });
    });
  });  