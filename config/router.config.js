export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'], 
    routes: [
      { path: '/', redirect: '/user', },
      {
        path: '/HomePage',
        name: 'HomePage',
        icon: 'dashboard',
        routes: [
         // 数据监控
          {
            path: '/HomePage/Home',
            name: 'Home',
            component: './HomePage/Home',
          },
          //订单统计
          {
            path: '/HomePage/Monitoring',
            name: 'Monitoring',
            component: './HomePage/Monitoring',
          },
        ],
      },
      // 零食商品管理
      {
        path: '/SnacksManager',
        icon: 'form',
        name: 'SnacksManager',
        routes: [
        //添加零食商品
          {
            path: '/SnacksManager/AddSnacks',
            name: 'AddSnacks',
            component: './SnacksManager/AddSnacks',
          },
          //零食商品列表
          {
            path: '/SnacksManager/SnacksList',
            name: 'SnacksList',
            component: './SnacksManager/SnacksList'
          },
          // 零食分类管理
          {
            path: 'SnacksManager/Classification',
            name: 'Classification',
            component: './SnacksManager/Classification',
          }
        ],
      },
      // 盒子申请管理
      {
        path: '/ApplicationBox',
        icon: 'table',
        name: 'ApplicationBox',
        routes: [
          //申请零食盒子
          // {
          //   path: '/ApplicationBox/AddApplicationBox',
          //   name: 'AddApplicationBox',
          //   component: './ApplicationBox/AddApplicationBox',
          // },
           //申请零食盒子的列表
          {
            path: '/ApplicationBox/ApplicationBoxList',
            name: 'ApplicationBoxList',
            component: './ApplicationBox/ApplicationBoxTab',
          },
        ],
      },
      //缺货提醒管理
      {
        path: '/ShortageRemind',
        name: 'ShortageRemind',
        icon: 'profile',
        routes: [
          // 缺货提醒列表
          {
            path: '/ShortageRemind/ShortageRemindList',
            name: 'ShortageRemindList',
            component: './ShortageRemind/ShortageRemindTab',
          },
          // 添加缺货提醒
          // {
          //   path: '/ShortageRemind/AddShortageRemind',
          //   name: 'AddShortageRemind',
          //   component: './ShortageRemind/AddShortageRemind',
          // },
        ],
      },
      // 宿舍二维码管理
      {
        path: '/QrcodeManager',
        name: 'QrcodeManager',
        icon: 'border-right',
        routes: [
          // 添加二维码与宿舍绑定
          // {
          //   path: '/QrcodeManager/AddQrcode',
          //   name: 'AddQrcode',
          //   component: './QrcodeManager/AddQrcode',
          // },
          // 查看所有宿舍二维码绑定
          {
            path: '/QrcodeManager/QrcodeList',
            name: 'QrcodeList',
            component: './QrcodeManager/QrcodeTab',
          },
        ],
      },
      // 订单管理
      {
        path: '/SnackOrderManager',
        name: 'SnackOrderManager',
        icon: 'shopping-cart',
        routes: [
          // 添加订单
          // {
          //   path: '/SnackOrderManager/AddSnackOrder',
          //   name: 'AddSnackOrder',
          //   component: './SnackOrderManager/AddSnackOrder',
          // },
          // 查看所有订单
          {
            path: '/SnackOrderManager/SnackOrderList',
            name: 'SnackOrderList',
            component: './SnackOrderManager/SnackOrderList',
          },
        ],
      },
      {
        name: 'integralaccount',
        icon: 'credit-card',
        path: '/integralaccount',
        routes: [
          //会员积分管理
          {
            path: '/integralaccount/integral',
            name: 'integral',
            component: './IntegralAccount/IntegralAccountList'
          },
          // 会员充值记录
          {
            path: '/integralaccount/MemberRecharge',
            name: 'MemberRecharge',
            component: './IntegralAccount/MemberRechargeList'
          },
         
        ],
      },
      {
        name: 'integralgoods',
        icon: 'gift',
        path: '/integralgoods',
        routes: [
          //积分商品管理
          {
            path: '/integralgoods/goods',
            name: 'goods',
            component: './Profile/BasicProfile'
          },
         
        ],
      },
      //管理员信息
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          //个人中心  备忘录
          {
            path: '/account/center',
            name: 'center',
            component: './Profile/BasicProfile'
          },
         
        ],
      },
      {
        name: 'fund',
        icon: 'alipay',
        path: '/fund',
        routes: [
          {
            path: '/fund/fundlist',
            name: 'fundlist',
            component: './Fund/fundList'
          },
          // {
          //   path: '/fund/Addfund',
          //   name: 'Addfund',
          //   component: './Fund/addfund'
          // },
          {
            path: '/fund/WithdrawList',
            name: 'WithdrawList',
            component: './Fund/WithdrawList'
          },
         
        ],
      },
      
      {
        component: '404',
      },
    ],
  },
];
