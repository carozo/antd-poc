import React, { useState } from 'react';
import { NotificationOutlined, EnvironmentOutlined, PictureOutlined, AntCloudOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input, MenuProps, Space } from 'antd';
import { Layout, Menu } from 'antd';
import { CityInformation } from '../cityInformation/CityInformation';

const { Header, Content, Footer, Sider } = Layout;

const sideBarOptions: MenuProps['items'] = [
  {
    key: `images`,
    icon: React.createElement(PictureOutlined),
    label: `Images`,
  },
  {
    key: `weather`,
    icon: React.createElement(AntCloudOutlined),
    label: `Weather`,
  },
  {
    key: `events`,
    icon: React.createElement(NotificationOutlined),
    label: `Events`,
  },
  {
    key: `places`,
    icon: React.createElement(EnvironmentOutlined),
    label: `Places`,
  },
];

export const HomeLayout = () => {
  const [selectedCity, setSelectedCity] = useState('Montevideo');
  const [selectedMenu, setSelectedMenu] = useState('weather');

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
        <Space wrap style={{ marginBottom: '20px' }}>
          <Button type="primary" onClick={() => setSelectedCity('Montevideo')}>Montevideo</Button>
          <Button type="primary" onClick={() => setSelectedCity('Madrid')}>Madrid</Button>
          <Button type="primary" onClick={() => setSelectedCity('Roma')}>Roma</Button>
          <Button type="primary" onClick={() => setSelectedCity('Amsterdam')}>Amsterdam</Button>
          <Button type="primary" onClick={() => setSelectedCity('Nueva York')}>Nueva York</Button>
        </Space>
        <Layout className="site-layout-background" style={{ padding: '24px 0', height: '95%' }}>
          <Sider className="site-layout-background" width={200}>
            <Menu
              mode="inline"
              onSelect={(selected) => setSelectedMenu(selected.key)}
              defaultSelectedKeys={['images']}
              style={{ height: '100%' }}
              items={sideBarOptions}
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <CityInformation queryString={selectedCity} menuShowed={selectedMenu} />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2020 Created by BCS</Footer>
    </Layout>
  );
};

export default HomeLayout;
