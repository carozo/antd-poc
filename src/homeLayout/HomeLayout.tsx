import React, { useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input, MenuProps, Space } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import { CityInformation } from '../cityInformation/CityInformation';

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

export const HomeLayout = () => {
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
        Cities
        <AutoComplete
          dropdownMatchSelectWidth={252}
          style={{ width: 300 }}
          options={[]} //Aca irian todas las ciudades disponibles, o ponemos todas?
          onSelect={() => {}}
          onSearch={(value) => setSelectedCity(value)}
        >
          <Input.Search size="large" placeholder="input here" enterButton />
        </AutoComplete>    
      </Header>
      <Content style={{ padding: '0 30px' }}>
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
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Space wrap style={{ marginBottom: '20px' }}>
              <Button type="primary" onClick={() => setSelectedCity('Montevideo')}>Montevideo</Button>
              <Button type="primary" onClick={() => setSelectedCity('Madrid')}>Madrid</Button>
              <Button type="primary" onClick={() => setSelectedCity('Roma')}>Roma</Button>
              <Button type="primary" onClick={() => setSelectedCity('Amsterdam')}>Amsterdam</Button>
              <Button type="primary" onClick={() => setSelectedCity('Nueva York')}>Nueva York</Button>
            </Space>
            <CityInformation queryString={selectedCity} />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2020 Created by BCS</Footer>
    </Layout>
  );
};

export default HomeLayout;
