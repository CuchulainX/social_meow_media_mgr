import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Table, ConfigProvider, List, Collapse, Card } from "antd";

import moment from "moment";
import "./styles.css";
import config from "../../config";

const { Panel } = Collapse;

const NoPosts = () => (
  <div
    style={{
      textAlign: "center"
    }}
  >
    <img
      width="12%"
      src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/155/crying-cat-face_1f63f.png"
      alt="Crying Cat"
    />
    <h3>No Posts This Day</h3>
  </div>
);

const displayStatus = postObject => {
  if (postObject.sending) {
    return "Sending";
  }
  if (postObject.sent) {
    return "Sent";
  }
  if (postObject.pub_ready_copy) {
    if (postObject.pub_ready_online) {
      return "Ready to post";
    }
    return "Copy-Edited";
  }
  if (postObject.sent_error) {
    return "Error";
  }
  return "Draft";
};

const displayTime = pubTime =>
  pubTime ? moment(pubTime, "HH:mm:ss").format("hh:mm a") : "No Time";

const statusCSS = record => {
  if (record.sent_error) return "sent-error";
  if (record.sending) return "sending";
  if (record.sent) return "sent";
  if (record.pub_ready_copy) {
    if (record.pub_ready_online) return "ready-to-post";
    return "copy-edited";
  }
  return "draft";
};

const displaySection = text =>
  text && this.props.sections ? this.props.sections.find(x => x.id === text).name : "No Section";

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* current visible columns */
      columns: this.truncateColumns()
    };
  }

  truncateColumns = () => {
    if (this.props.device === config.MOBILE) {
      return this.columns.filter(x => x.key === "section" || x.key === "slug");
    }

    return this.columns;
  };

  columns = [
    {
      key: "section",
      title: "section",
      dataIndex: "section",
      className: "section",
      sortDirections: ["ascend", "descend"],
      render: text => displaySection(text),
      sorter: (a, b) => a.section - b.section
    },
    {
      key: "slug",
      title: "slug",
      dataIndex: "slug",
      className: "slug",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => a.slug.localeCompare(b.slug)
    },
    {
      key: "post_twitter",
      title: "tweet",
      dataIndex: "post_twitter",
      className: "twitter",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => a.post_twitter.localeCompare(b.post_twitter)
    },
    {
      key: "post_facebook",
      title: "facebook",
      dataIndex: "post_facebook",
      className: "facebook",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => a.post_facebook.localeCompare(b.post_facebook)
    },
    {
      key: "pub_time",
      title: "post time",
      dataIndex: "pub_time",
      className: "pub_time",
      sortDirections: ["ascend", "descend"],
      defaultSortOrder: "descend",
      sorter: (a, b) => a.pub_time < b.pub_time,
      render: text => displayTime(text)
    },
    {
      key: "status",
      title: "status",
      dataIndex: "status",
      className: "status",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) =>
        b.pub_ready_copy - a.pub_ready_copy ||
        b.pub_ready_online - a.pub_ready_online ||
        b.sent - a.sent ||
        b.sending - a.sending ||
        new Date(b.pub_time) - new Date(a.pub_time) ||
        b.id - a.id,
      render: (text, record) => displayStatus(record)
    }
  ];

  renderDesktop() {
    return (
      <div id="meow-table-wrapper">
        <Table
          pagination={false}
          className="post-table"
          rowKey="id"
          dataSource={this.props.data}
          columns={this.state.columns}
          onRowClick={record => this.props.history.push(`/edit/${record.id}`)}
          rowClassName={record => statusCSS(record)}
        />
      </div>
    );
  }

  renderMobile() {
    return (
      <Collapse>
        {this.props.data.map(post => (
          <Panel
            className="mobile_post_panel"
            header={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "1em 0px 0px 0px", fontSize: "1.2em" }}>{post.slug}</div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "100%", padding: "1em 0" }}>
                    {displayTime(post.pub_time)}
                  </div>
                  <div
                    className={`status ${statusCSS(post)}`}
                    style={{ width: "100%", padding: "1em 0", textAlign: "center" }}
                  >
                    {displayStatus(post)}
                  </div>
                </div>
              </div>
            }
          >
            <Card size="small" title={displaySection(post.section)} />
            <Card size="small" title="tweet">
              {post.post_twitter}
            </Card>
            <Card size="small" title="facebook">
              {post.post_facebook}
            </Card>
          </Panel>
        ))}
      </Collapse>
    );
  }

  render() {
    return (
      <ConfigProvider renderEmpty={NoPosts}>
        {this.props.device === config.MOBILE ? this.renderMobile() : this.renderDesktop()}
      </ConfigProvider>
    );
  }
}

const mapStateToProps = state => ({
  sections: state.default.section.sections,
  device: state.default.mobile.device
});

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Posts)
);
