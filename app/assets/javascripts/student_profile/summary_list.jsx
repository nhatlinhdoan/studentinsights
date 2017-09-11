(function () {
  window.shared || (window.shared = {});

  window.shared.SummaryList = React.createClass({
    displayName: 'SummaryList',

    propTypes: {
      title: React.PropTypes.string.isRequired,
      elements: React.PropTypes.arrayOf(React.PropTypes.node).isRequired
    },

    render() {
      return (
        <div className="SummaryList" style={{ paddingBottom: 10 }}>
          <div style={{ fontWeight: 'bold' }}>
            {this.props.title}
          </div>
          <ul>
            {this.props.elements.map((element, index) => (
              <li key={index}>
                {element}
              </li>
              ))}
          </ul>
        </div>
      );
    }
  });
}());
