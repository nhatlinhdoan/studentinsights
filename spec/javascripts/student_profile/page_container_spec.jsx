import { nowMoment, studentProfile } from './fixtures.jsx';
import SpecSugar from '../support/spec_sugar.jsx';

describe('PageContainer', () => {
  const merge = window.shared.ReactHelpers.merge;
  const ReactDOM = window.ReactDOM;
  const PageContainer = window.shared.PageContainer;

  const helpers = {
    findColumns(el) {
      return $(el).find('.summary-container > div');
    },

    interventionSummaryLists(el) {
      return $(el).find('.interventions-column .SummaryList').toArray();
    },

    createSpyActions() {
      return {
        onColumnClicked: jasmine.createSpy('onColumnClicked'),
        onClickSaveNotes: jasmine.createSpy('onClickSaveNotes'),
        onClickSaveService: jasmine.createSpy('onClickSaveService'),
        onClickDiscontinueService: jasmine.createSpy('onClickDiscontinueService'),
        onDeleteEventNoteAttachment: jasmine.createSpy('onDeleteEventNoteAttachment')
      };
    },

    createSpyApi() {
      return {
        saveNotes: jasmine.createSpy('saveNotes'),
        deleteEventNoteAttachment: jasmine.createSpy('deleteEventNoteAttachment'),
        saveService: jasmine.createSpy('saveService'),
        discontinueService: jasmine.createSpy('discontinueService')
      };
    },

    renderInto(el, props) {
      const mergedProps = merge(props || {}, {
        nowMomentFn() { return nowMoment; },
        serializedData: studentProfile,
        queryParams: {},
        history: SpecSugar.history(),
        actions: helpers.createSpyActions(),
        api: helpers.createSpyApi()
      });
      return ReactDOM.render(<PageContainer {...mergedProps} />, el); // eslint-disable-line react/no-render-return-value
    },

    takeNotesAndSave(el, uiParams) {
      $(el).find('.btn.take-notes').click();
      SpecSugar.changeTextValue($(el).find('textarea'), uiParams.text);
      $(el).find(`.btn.note-type:contains(${uiParams.eventNoteTypeText})`).click();
      $(el).find('.btn.save').click();
    },

    editNoteAndSave(el, uiParams) {
      const $noteCard = $(el).find('.NotesList .NoteCard').first();
      const $text = $noteCard.find('.note-text');
      $text.html(uiParams.text);
      React.addons.TestUtils.Simulate.input($text.get(0));
      React.addons.TestUtils.Simulate.blur($text.get(0));
    },

    recordServiceAndSave(el, uiParams) {
      $(el).find('.btn.record-service').click();
      $(el).find(`.btn.service-type:contains(${uiParams.serviceText})`).click();
      SpecSugar.changeReactSelect($(el).find('.Select'), uiParams.educatorText);
      SpecSugar.changeTextValue($(el).find('.datepicker'), uiParams.dateStartedText);
      $(el).find('.btn.save').click();
    }
  };

  SpecSugar.withTestEl('integration tests', () => {
    it('renders everything on the happy path', function () {
      const el = this.testEl;
      helpers.renderInto(el);

      expect(el).toContainText('Daisy Poppins');
      expect(helpers.findColumns(el).length).toEqual(5);
      expect($(el).find('.Sparkline').length).toEqual(9);
      expect($(el).find('.InterventionsDetails').length).toEqual(1);

      const interventionLists = helpers.interventionSummaryLists(el);
      expect(interventionLists.length).toEqual(3);
      expect(interventionLists[0]).toContainText('Reg Ed');
      expect(interventionLists[0]).toContainText('Homeroom 102');
      expect(interventionLists[1]).toContainText('Counseling, outside');
      expect(interventionLists[1]).toContainText('Attendance Contract');
    });

    it('opens dialog when clicking Take Notes button', function () {
      const el = this.testEl;
      helpers.renderInto(el);

      $(el).find('.btn.take-notes').click();
      expect(el).toContainText('What are these notes from?');
      expect(el).toContainText('Save notes');
    });

    it('opens dialog when clicking Record Service button', function () {
      const el = this.testEl;
      helpers.renderInto(el);

      $(el).find('.btn.record-service').click();
      expect(el).toContainText('Who is working with Daisy?');
      expect(el).toContainText('Record service');
    });

    it('can save notes for SST meetings, mocking the action handlers', function () {
      const el = this.testEl;
      const component = helpers.renderInto(el);
      helpers.takeNotesAndSave(el, {
        eventNoteTypeText: 'SST Meeting',
        text: 'hello!'
      });

      expect(component.props.actions.onClickSaveNotes).toHaveBeenCalledWith({
        eventNoteTypeId: 300,
        text: 'hello!',
        eventNoteAttachments: []
      });
    });

    it('can edit notes for SST meetings, mocking the action handlers', function () {
      const el = this.testEl;
      const component = helpers.renderInto(el);

      helpers.editNoteAndSave(el, {
        eventNoteTypeText: 'SST Meeting',
        text: 'world!'
      });

      expect(component.props.actions.onClickSaveNotes).toHaveBeenCalledWith({
        id: 3,
        eventNoteTypeId: 300,
        text: 'world!'
      });
    });

    it('verifies that the educator name is in the correct format', function () {
      const el = this.testEl;
      const component = helpers.renderInto(el, {});

      // Simulate that the server call is still pending
      component.props.api.saveService.and.returnValue($.Deferred());
      component.onClickSaveService({
        providedByEducatorName: 'badinput'
      });
      expect(el).toContainText('Please use the form Last Name, First Name');

      component.onClickSaveService({
        providedByEducatorName: 'Teacher, Test'
      });
      expect(el).toContainText('Saving...');

      // Name can also be blank
      component.onClickSaveService({
        providedByEducatorName: ''
      });
      expect(el).toContainText('Saving...');
    });

    // TODO(kr) the spec helper here was reaching into the react-select internals,
    // which changed in 1.0.0, this needs to be updated.
    // it('can save an Attendance Contract service, mocking the action handlers', function() {
    //   var el = this.testEl;
    //   var component = helpers.renderInto(el);
    //   helpers.recordServiceAndSave(el, {
    //     serviceText: 'Attendance Contract',
    //     educatorText: 'fake-fifth-grade',
    //     dateStartedText: '2/22/16'
    //   });

    //   expect(component.props.actions.onClickSaveService).toHaveBeenCalledWith({
    //     serviceTypeId: 503,
    //     providedByEducatorId: 2,
    //     dateStartedText: '2016-02-22',
    //     recordedByEducatorId: 1
    //   });
    // });

    it('#mergedDiscontinueService', function () {
      const el = this.testEl;
      const instance = helpers.renderInto(el);
      const updatedState = instance.mergedDiscontinueService(instance.state, 312, 'foo');
      expect(Object.keys(updatedState)).toEqual(Object.keys(instance.state));
      expect(updatedState.requests.discontinueService).toEqual({ 312: 'foo' });
      expect(instance.mergedDiscontinueService(updatedState, 312, null)).toEqual(instance.state);
    });
  });
});
