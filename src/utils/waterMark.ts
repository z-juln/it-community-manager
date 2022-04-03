export const setWaterMark = (str: string) => {
  const WaterMarkDom = document.getElementById('water-mark')
  if (!WaterMarkDom) return
  const CANVAS = document.createElement('canvas')!;
  const context = CANVAS.getContext('2d')!;
  CANVAS.width = 225;
  CANVAS.height = 225;
  CANVAS.style.transform = 'rotate(-15deg)';
  CANVAS.style.transformOrigin = '50% 50%';
  CANVAS.style.position = 'absolute';
  // context.fillStyle = '#fff'; //填充颜色
  // context.fillRect(0,0,225,225);

  context.font = "14px PingFang SC";
  // 设置颜色
  context.fillStyle = "#8f959e";
  // // 设置水平对齐方式
  context.textAlign = "center";
  // 设置垂直对齐方式
  context.textBaseline = "middle";
  context.rotate((Math.PI / 180) * -15);
  //填充字符串
  context.fillText(str, 112, 112);
  const imgSrc = CANVAS.toDataURL();
  WaterMarkDom.style.backgroundImage = `url(${imgSrc}), url(${imgSrc})`;
}

export const removeWaterMark = () => {
  const WaterMarkDom = document.getElementById('water-mark')
  if (!WaterMarkDom) return
  WaterMarkDom.style.background = `none`;
}
