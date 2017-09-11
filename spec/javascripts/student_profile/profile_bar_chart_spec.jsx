import SpecSugar from '../support/spec_sugar.jsx';

describe('ProfileBarCharts', () => {
  const ProfileBarChart = window.shared.ProfileBarChart;
  const merge = window.shared.ReactHelpers.merge;
  const ReactDOM = window.ReactDOM;

  const helpers = {
    renderInto(el, props) {
      const mergedProps = merge({
        events: [],
        id: 'foo-id',
        titleText: 'foo-title',
        monthsBack: 48,
        nowMomentUTC: moment.utc('2017-02-02T13:23:15+00:00')
      }, props || {});
      ReactDOM.render(<ProfileBarChart {...mergedProps} />, el);
    }
  };

  SpecSugar.withTestEl('integration tests', () => {
    it('is wrapped in a div with the given id', function () {
      const el = this.testEl;
      helpers.renderInto(el, { id: 'foo' });

      const div = $(el).children().first();
      expect(div.attr('id')).toEqual('foo');
    });
  });
});
