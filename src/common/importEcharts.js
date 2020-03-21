//@ts-check

/*
  这个文件用来导入 ECharts 中需要的模块
*/

import echarts from 'echarts/lib/echarts';

// 参考:
// https://github.com/hustcc/echarts-for-react#typescript

import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legend/scrollableLegendAction';
import 'echarts/lib/component/legend/ScrollableLegendModel';
import 'echarts/lib/component/legend/ScrollableLegendView';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/title';


export default echarts;
