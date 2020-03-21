import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import logo from '../assets/kb.png';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 鳄鱼工作室 --- <img src={logo} alt="footer" style={{ marginLeft: 10, marginRight: 10 }} />--- 零趣盒子
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
