import React from "react";
import { withRouter } from "react-router";
import axios from "axios";
import ReactTable from "react-table";

function Td({ children, to }) {
  // Conditionally wrapping content into a link
  const content = to ? (
    <Link className={styles.content} to={to}>
      {children}
    </Link>
  ) : (
    <div className={styles.content}>{children}</div>
  );

  return <td>{content}</td>;
}

class PostGetterBase extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cols = [
      { Header: "Post ID", accessor: "id" },
      { Header: "Slug", accessor: "slug" },
      { Header: "Link", accessor: "story_url" },
      { Header: "Pub Time", accessor: "pub_time" }
    ];

    const posts = this.props.posts;

    return (
      <ReactTable
        data={posts}
        columns={cols}
        getTdProps={(state, rowInfo) => {
          return {
            onClick: () => {
              this.props.history.push(`/posts/${rowInfo.original.id}`);
            }
          };
        }}
      />
    );
  }
}

const PostGetter = withRouter(PostGetterBase);
export default PostGetter;
