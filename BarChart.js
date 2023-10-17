export default class BarChart {
  #barColor = 'rgba(34, 145, 23, 0.5)'
  #canvas
  #canvasTopPadding = 60
  #canvasBottomPadding = 70
  #canvasRightPadding = 20
  #canvasLeftPadding = 100
  #chartAreaWidth
  #chartAreaHeight
  #chartAreaXpos
  #chartAreaYpos
  #context
  #data
  #categories

  /**
   * Creates a bar chart given the id of the canvas element
   *
   * @param {String} id - The id of the canvas element
   */
  constructor(id) {
    this.#canvas = document.getElementById(id)
    this.#context = this.#canvas.getContext('2d')

    // set default height and width
    this.setWidth(600)
    this.setHeight(300)
    this.#drawChart()
  }

  /**
   * Sets the categories for the x-axis for the bar chart. The number of categories must match the number of data points.
   *
   * @param {Array} xLabels - An array of strings representing the categories for the x-axis
   */
  setCategories(xLabels) {
    this.#categories = xLabels;
    const barAreaWidth = this.#chartAreaWidth / xLabels.length
    const y = this.#chartAreaYpos + this.#chartAreaHeight + 16

    for (let i = 0; i < xLabels.length; i++) {
      let x = this.#chartAreaXpos + (barAreaWidth / 2) + i * barAreaWidth
      this.#drawCategory(xLabels[i], x, y)
    }
  }

  /**
   * Sets the color of the bars in the bar chart.
   *
   * @param {String} color - The color of the bars, in format '#RRGGBB' or 'rgba(R, G, B, A)'.
   */
  setColor(color) {
    this.#barColor = color
    this.#drawChart()
  }

  /**
   * Sets the color of the bars in the bar chart to random colors.
   */
  setRandomColors() {
    this.#drawBarsInRandomColors(this.#data)
  }

  /**
   * Sets the data for the bar chart. The number of data points must match the number of categories.
   *
   * @param {Array} data - An array of numbers representing the data points for the bar chart.
   */
  setData(data) {
    this.#data = data
    this.#drawChart()
  }

  /**
   * Sets the height of the canvas element, in pixels.
   *
   * @param {Number} newHeight - The new height of the canvas element in pixels
   */
  setHeight(newHeight) {
    this.#canvas.height = newHeight
    this.#drawChart()
  }

  /**
   * Sets the title of the bar chart. The title will be positioned above the bar chart.
   *
   * @param {String} title - The title of the bar chart 
   */
  setTitle(title) {
    const x = this.#canvasLeftPadding
    const y = this.#canvasTopPadding - 20
    this.#drawTitle(title, x, y)
  }

  /**
   * Sets the width of the canvas element, in pixels.
   *
   * @param {Number} newWidth - The new width of the canvas element in pixels
   */
  setWidth(newWidth) {
    this.#canvas.width = newWidth
    this.#drawChart()
  }

  /**
   * Sets the label for the x-axis.
   *
   * @param {String} label - The label for the x-axis
   */
  setXAxisLabel(label) {
    const x = this.#chartAreaXpos + this.#chartAreaWidth / 2
    const y = this.#chartAreaYpos + this.#chartAreaHeight + this.#canvasBottomPadding * 2 / 3
    this.#drawXAxisLabel(label, x, y)
  }

  /**
   * Sets the label for the y-axis.
   *
   * @param {String} label - The label for the y-axis 
   */
  setYAxisLabel(label) {
    const x = this.#canvasLeftPadding / 5 * 2
    const y = this.#chartAreaYpos + (this.#chartAreaHeight / 2)
    this.#drawYAxisLabel(label, x, y)
  }

  // private methods
  #drawBar(posX, posY, width, height, color) {
    this.#drawRectangle(posX, posY, width, height, color)
    this.#drawOutLinedRectangle(posX, posY, width, height, color)
  }

  #drawBars(data, color) {
    let barSidePadding = 10
    const numberOfDataPoints = data.length
    const maxValue = this.#getMaxValue(data)
    const barAreaWidth = this.#chartAreaWidth / numberOfDataPoints
    const scalingFactor = this.#chartAreaHeight / maxValue
    let barWidth = barAreaWidth - barSidePadding * 2

    // make space between bars bigger if there are few bars
    if (barWidth - barSidePadding > 80) {
      barSidePadding = 50
      barWidth = barAreaWidth - barSidePadding * 2
    } else {
      barSidePadding = 10
      barWidth = barAreaWidth - barSidePadding * 2
    }

    // draw bar for every data point
    for (let i = 0; i < numberOfDataPoints; i++) {
      const x = this.#chartAreaXpos + i * barAreaWidth + barSidePadding
      const y = this.#chartAreaYpos + this.#chartAreaHeight - data[i] * scalingFactor
      const barHeight = scalingFactor * data[i]

      this.#drawBar(x, y, barWidth, barHeight, color);
    }
  }

  #drawBarsInRandomColors(data) {
    let barSidePadding = 10
    const numberOfDataPoints = data.length
    const maxValue = this.#getMaxValue(data)
    const barAreaWidth = this.#chartAreaWidth / numberOfDataPoints
    const scalingFactor = this.#chartAreaHeight / maxValue
    let barWidth = barAreaWidth - barSidePadding * 2

    // make space between bars bigger if there are few bars
    if (barWidth - barSidePadding > 80) {
      barSidePadding = 50
      barWidth = barAreaWidth - barSidePadding * 2
    } else {
      barSidePadding = 10
      barWidth = barAreaWidth - barSidePadding * 2
    }

    // draw bar for every data point
    for (let i = 0; i < numberOfDataPoints; i++) {
      const x = this.#chartAreaXpos + i * barAreaWidth + barSidePadding
      const y = this.#chartAreaYpos + this.#chartAreaHeight - data[i] * scalingFactor
      const barHeight = scalingFactor * data[i]

      this.#drawBar(x, y, barWidth, barHeight, this.#generateRandomColor());
    }
  }

  #drawBorder(lineWidth, color) {
    // draw corners
    const margin = lineWidth / 2
    this.#drawQuarterCircle(margin, margin, lineWidth / 2, color, 2)
    this.#drawQuarterCircle(this.#canvas.width - margin, margin, lineWidth / 2, color, 1)
    this.#drawQuarterCircle(this.#canvas.width - margin, this.#canvas.height - margin, lineWidth / 2, color, 4)
    this.#drawQuarterCircle(margin, this.#canvas.height - margin, lineWidth / 2, color, 3)

    // draw line connecting the corneres
    this.#drawLine(margin, margin, this.#canvas.width - margin, margin, lineWidth, color)
    this.#drawLine(margin, margin, margin, this.#canvas.height - margin, lineWidth, color)
    this.#drawLine(margin, this.#canvas.height - margin, this.#canvas.width - margin, this.#canvas.height - margin, lineWidth, color)
    this.#drawLine(this.#canvas.width - margin, margin, this.#canvas.width - margin, this.#canvas.height - margin, lineWidth, color)
  }

  #drawCategory(text, x, y) {
    this.#context.fillStyle = "#000000"
    this.#context.font = "12px Arial"
    this.#context.textAlign = 'center'
    this.#context.fillText(text, x, y)
  }

  #drawChart() {
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#setChartAreaOrigin()
    this.#setChartAreaWidth()
    this.#setChartAreaHeight()
    this.#drawBorder(10, '#DDDDDD')
    this.#drawXAxis('#000000')
    this.#drawYAxis('#000000')
    if (typeof this.#data !== 'undefined') {
      this.#drawYAxisScale(this.#data)
      this.#drawHorizontalLines(this.#data)
      this.#drawBars(this.#data, this.#barColor)
      this.#drawXAxis('#000000')
    }
    if (typeof this.#categories !== 'undefined') {
      this.setCategories(this.#categories)
      this.#drawXAxis('#000000')
    }
  }

  #drawHorizontalLines(data) {
    const maxValue = this.#getMaxValue(data)
    const scalingFactor = this.#chartAreaHeight / maxValue
    const startX = this.#chartAreaXpos
    const endX = this.#chartAreaXpos + this.#chartAreaWidth
    
    let increment
    if (maxValue < 10) {
      increment = 1
    } else if (maxValue < 200) { 
      increment = 10
    } else { 
      increment = 100
    }

    for (let i = 0; i <= maxValue; i = i + increment) {
      const y = this.#chartAreaYpos + this.#chartAreaHeight - (i * scalingFactor)
      this.#drawLine(startX, y, endX, y, 2, '#CCCCCC')
    }
  }

  #drawLine(startX, startY, endX, endY, lineWidth, color) {
    this.#context.beginPath()
    this.#context.moveTo(startX, startY)
    this.#context.lineTo(endX, endY)
    this.#context.strokeStyle = color
    this.#context.lineWidth = lineWidth
    this.#context.stroke()
  }

  #drawOutLinedRectangle(posX, posY, width, height, color) {
    this.#context.strokeStyle = color
    this.#context.lineWidth = 2
    this.#context.strokeRect(posX, posY, width, height)
  }

  #drawQuarterCircle(xPos, yPos, radius, color, quadrant) {
    this.#context.beginPath()
    // determine which quarter circle to draw
    if (quadrant === 1) {
      this.#context.arc(xPos, yPos, radius, (Math.PI / 2) * 3, 2 * Math.PI)
    } else if (quadrant === 2) {
      this.#context.arc(xPos, yPos, radius, Math.PI, (Math.PI / 2) * 3)
    } else if (quadrant === 3) {
      this.#context.arc(xPos, yPos, radius, Math.PI / 2, Math.PI)
    } else if (quadrant === 4) {
      this.#context.arc(xPos, yPos, radius, 0, Math.PI / 2)
    }
    this.#context.lineTo(xPos, yPos)
    this.#context.closePath()
    this.#context.fillStyle = color
    this.#context.fill()
  }

  #drawRectangle(posX, posY, width, height, color) {
    this.#context.fillStyle = color
    this.#context.fillRect(posX, posY, width, height)
  }

  #drawTitle(title, x, y) {
    this.#context.fillStyle = "#333333"
    this.#context.font = "18px Arial"
    this.#context.fillText(title, x, y)
  }

  #drawXAxis(color) {
    const lineWidth = 2;
    const startX = this.#chartAreaXpos
    const startY = this.#chartAreaYpos + this.#chartAreaHeight
    const endX = this.#chartAreaXpos + this.#chartAreaWidth
    const endY = this.#chartAreaYpos + this.#chartAreaHeight

    this.#drawLine(startX, startY, endX, endY, lineWidth, color);
  }

  #drawXAxisLabel(label, x, y) {
    this.#context.fillStyle = "#000000"
    this.#context.font = "16px Arial"
    this.#context.textAlign = 'center'
    this.#context.fillText(label, x, y)
  }

  #drawYAxis(color) {
    const lineWidth = 2;
    const startX = this.#chartAreaXpos
    const startY = this.#chartAreaYpos
    const endX = this.#chartAreaXpos
    const endY = this.#chartAreaYpos + this.#chartAreaHeight

    this.#drawLine(startX, startY, endX, endY, lineWidth, color);
  }

  #drawYAxisLabel(label, x, y) {
    this.#context.save()
    this.#context.translate(x, y)
    this.#context.rotate(- Math.PI / 2)
    this.#context.fillStyle = "#000000"
    this.#context.font = "16px Arial"
    this.#context.textAlign = 'center'
    this.#context.fillText(label, 0, 0)
    this.#context.restore()
  }

  #drawYAxisScale(data) {
    const maxValue = this.#getMaxValue(data)
    const scalingFactor = this.#chartAreaHeight / maxValue
    const scaleLineWidth = 10
    const startX = this.#chartAreaXpos - scaleLineWidth
    const endX = this.#chartAreaXpos

    let increment = maxValue / 10

    if (maxValue < 10) {
      increment = 1
    } else if (maxValue < 200) { 
      increment = 10
    } else { 
      increment = 100
    }

    for (let i = 0; i <= maxValue; i = i + increment) {
      // draw scale line
      const y = this.#chartAreaYpos + this.#chartAreaHeight - (i * scalingFactor)
      this.#drawLine(startX, y, endX, y, 2, '#000000')

      // draw value of scale
      this.#context.fillStyle = "#000000"
      this.#context.font = "12px Arial"
      this.#context.textAlign = 'center'
      this.#context.fillText(i, this.#chartAreaXpos - scaleLineWidth - 10, y + 4)
    }
  }

  #getMaxValue(data) {
    return Math.max(...data)
  }

  #generateRandomColor() {
    const hexDigits = '0123456789ABCDEF'
    let color = '#'

    for (let i = 0; i < 6; i++) {
      color += hexDigits[Math.floor(Math.random() * 16)]
    }
    return color
  }

  #setChartAreaHeight() {
    this.#chartAreaHeight = this.#canvas.height - this.#canvasTopPadding - this.#canvasBottomPadding
  }

  #setChartAreaOrigin() {
    this.#chartAreaXpos = this.#canvasLeftPadding
    this.#chartAreaYpos = this.#canvasTopPadding
  }

  #setChartAreaWidth() {
    this.#chartAreaWidth = this.#canvas.width - this.#canvasLeftPadding - this.#canvasRightPadding
  }

}
