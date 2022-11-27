import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { AutoComplete, Input, MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const sideBarOptions: MenuProps['items'] = [
  {
    key: `sub${1}`,
    icon: React.createElement(UserOutlined),
    label: `Weather`,
  },
  {
    key: `sub${2}`,
    icon: React.createElement(LaptopOutlined),
    label: `Events`,
  },
  {
    key: `sub${3}`,
    icon: React.createElement(NotificationOutlined),
    label: `Places`,
  },
];

export const HomeLayout: React.FC = () => (
  <Layout style={{ height: '100vh' }}>
    <Header className="header" style={{ display: 'flex', flexDirection: 'row', color: 'black', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#acc1ed', fontSize: 'x-large' }}>
      Cities
      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 300 }}
        options={[]}
        onSelect={() => {}}
        onSearch={() => {}}
      >
        <Input.Search size="large" placeholder="input here" enterButton />
      </AutoComplete>    
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>City Name</Breadcrumb.Item>
      </Breadcrumb>
      <Layout className="site-layout-background" style={{ padding: '24px 0', height: '95%' }}>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['sub1']}
            style={{ height: '100%' }}
            items={sideBarOptions}
          />
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
      </Layout>
    </Content>
    <Footer style={{ textAlign: 'center' }}>©2020 Created by BCS</Footer>
  </Layout>
);

export default HomeLayout;
