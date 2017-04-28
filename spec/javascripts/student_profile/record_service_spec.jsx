import SpecSugar from '../support/spec_sugar.jsx';

//= require ./fixtures

describe('RecordService', function() {
  const createEl = window.shared.ReactHelpers.createEl;
  const merge = window.shared.ReactHelpers.merge;

  const RecordService = window.shared.RecordService;
  const Fixtures = window.shared.Fixtures;

  const helpers = {
    renderInto: function(el, props) {
      const mergedProps = merge(props || {}, {
        studentFirstName: 'Tamyra',
        serviceTypesIndex: Fixtures.studentProfile.serviceTypesIndex,
        educatorsIndex: Fixtures.studentProfile.educatorsIndex,
        nowMoment: Fixtures.nowMoment,
        currentEducator: Fixtures.currentEducator,
        onSave: jasmine.createSpy('onSave'),
        onCancel: jasmine.createSpy('onCancel'),
        requestState: null,
        studentId: 1
      });
      return ReactDOM.render(<RecordService {...mergedProps} />, el);
    },

    serviceTypes: function(el) {
      return $(el).find('.btn.service-type').toArray().map(function(el) {
        return $.trim(el.innerText);
      });
    },

    findSaveButton: function(el) {
      return $(el).find('.btn.save');
    }
  };

  SpecSugar.withTestEl('integration tests', function() {
    it('renders dialog for recording services', function() {
      const el = this.testEl;
      helpers.renderInto(el);

      expect(el).toContainText('Which service?');
      expect(helpers.serviceTypes(el)).toEqual([
        'Attendance Contract',
        'Attendance Officer',
        'Behavior Contract',
        'Counseling, in-house',
        'Counseling, outside',
        'Reading intervention'
      ]);


      expect(el).toContainText('Who is working with Tamyra?');
      // TODO (as): test staff dropdown autocomplete async
      expect(el).toContainText('When did they start?');
      expect($(el).find('.Datepicker .datepicker.hasDatepicker').length).toEqual(1);
      expect(helpers.findSaveButton(el).length).toEqual(1);
      expect(helpers.findSaveButton(el).attr('disabled')).toEqual('disabled');
      expect($(el).find('.btn.cancel').length).toEqual(1);
    });
  });
});
