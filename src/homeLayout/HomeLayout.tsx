import React from "react";
import {
  NotificationOutlined,
  HomeOutlined,
  CloudOutlined,
} from "@ant-design/icons";
import { AutoComplete, Input, MenuProps } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
import { CityInformation, HotelInfo } from "../cityInformation/CityInformation";

const { Header, Content, Footer, Sider } = Layout;

const sideBarOptions: MenuProps["items"] = [
  {
    key: `sub${1}`,
    icon: React.createElement(CloudOutlined),
    label: `Weather`,
  },
  {
    key: `sub${2}`,
    icon: React.createElement(HomeOutlined),
    label: `Hotels`,
  },
  {
    key: `sub${3}`,
    icon: React.createElement(NotificationOutlined),
    label: `Places`,
  },
];

export const HomeLayout: React.FC = () => {
  const [selectedKey, setSelectedKey] = React.useState("sub1");
  console.log(selectedKey);
  return (
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
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
      <Content style={{ padding: "0 30px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>City Name</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          className="site-layout-background"
          style={{ padding: "24px 0", height: "95%" }}
        >
          <Sider className="site-layout-background" width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["sub1"]}
              style={{ height: "100%" }}
              selectedKeys={[selectedKey]}
              items={sideBarOptions}
              onClick={({ key }) => setSelectedKey(`${key}`)}
            />
          </Sider>
          {selectedKey === "sub1" ? (
            <Content style={{ padding: "0 24px", minHeight: 280 }}>
              <CityInformation />
            </Content>
          ) : selectedKey === "sub2" ? (
            <HotelInfo />
          ) : (
            <></>
          )}
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}>©2020 Created by BCS</Footer>
    </Layout>
  );
};

export default HomeLayout;
