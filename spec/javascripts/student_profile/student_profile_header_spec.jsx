import { studentProfile } from './fixtures.jsx';
import SpecSugar from '../support/spec_sugar.jsx';


describe('StudentProfileHeader', () => {
  const merge = window.shared.ReactHelpers.merge;
  const ReactDOM = window.ReactDOM;
  const StudentProfileHeader = window.shared.StudentProfileHeader;

  const helpers = {
    renderActiveStudent(el, props) {
      const mergedProps = merge(props || {}, { student: studentProfile.student });
      ReactDOM.render(<StudentProfileHeader {...mergedProps} />, el);
    },

    renderTransferredStudent(el, props) {
      const this_student = studentProfile.student;
      this_student.enrollment_status = 'Transferred';

      const mergedProps = merge(props || {}, { student: this_student });
      ReactDOM.render(<StudentProfileHeader {...mergedProps} />, el);
    }

  };

  SpecSugar.withTestEl('active enrolled student', () => {
    it('renders note-taking area with homeroom', function () {
      const el = this.testEl;
      helpers.renderActiveStudent(el);
      const yearsOld = moment().diff(studentProfile.student.date_of_birth, 'years'); // TODO (ARS): mock moment.utc() for spec
                                                                                           // so we don't have to calculate this

      expect(el).toContainText('Daisy Poppins');
      expect(el).toContainText('Arthur D Healey');
      expect(el).toContainText('5/23/2008');
      expect(el).toContainText(`(${yearsOld} years old)`);
      expect(el).toContainText('1 Memorial Dr, Cambridge, MA 02142');
      expect($(el).find('a.homeroom-link')).toContainText('102');
    });
  });

  SpecSugar.withTestEl('non-active Transferred student', () => {
    it('renders note-taking area with Transferred status', function () {
      const el = this.testEl;
      helpers.renderTransferredStudent(el);

      expect(el).toContainText('Daisy Poppins');
      expect(el).toContainText('Arthur D Healey');
      expect(el).toContainText('Transferred');
    });
  });
});
