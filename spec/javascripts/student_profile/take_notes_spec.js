//= require ./fixtures
import SpecSugar from '../support/spec_sugar.js';
import TakeNotes from '../../../app/assets/javascripts/student_profile/take_notes.jsx';


describe('TakeNotes', function() {
  var merge = window.shared.ReactHelpers.merge;
  var Fixtures = window.shared.Fixtures;

  var helpers = {
    renderInto: function(el, props) {
      var mergedProps = merge(props || {}, {
        nowMoment: Fixtures.nowMoment,
        eventNoteTypesIndex: Fixtures.studentProfile.eventNoteTypesIndex,
        currentEducator: Fixtures.currentEducator,
        onSave: jasmine.createSpy('onSave'),
        onCancel: jasmine.createSpy('onCancel'),
        requestState: null
      });
      window.ReactDOM.render(<TakeNotes {...mergedProps} />, el);
    }
  };

  SpecSugar.withTestEl('high-level integration tests', function() {
    it('renders note-taking area', function() {
      var el = this.testEl;
      helpers.renderInto(el);

      expect(el).toContainText('February 11, 2016');
      expect(el).toContainText('demo@example.com');
      expect($(el).find('textarea').length).toEqual(1);
      expect($(el).find('.btn.note-type').length).toEqual(4);
      expect($(el).find('.btn.save').length).toEqual(1);
      expect($(el).find('.btn.cancel').length).toEqual(1);
    });
  });
});
