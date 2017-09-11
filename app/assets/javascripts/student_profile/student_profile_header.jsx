(function () {
  window.shared || (window.shared = {});
  const Routes = window.shared.Routes;
  const RiskBubble = window.shared.RiskBubble;

  const styles = {
    titleContainer: {
      fontSize: 16,
      padding: 20,
      display: 'flex'
    },
    nameTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginRight: 5
    },
    titleItem: {
      fontSize: 24,
      padding: 5
    },
    subtitleItem: {
      fontSize: 22,
      padding: 5
    }
  };

  /*
  This pure UI component renders top-line information like the student's name, school and
  classroom.
  */
  window.shared.StudentProfileHeader = React.createClass({
    displayName: 'StudentProfileHeader',

    propTypes: {
      student: React.PropTypes.object.isRequired
    },

    render() {
      const student = this.props.student;
      return (
        <div style={styles.titleContainer}>
          <div style={{ display: 'inline-block', flex: 'auto' }}>
            <a href={Routes.studentProfile(student.id)} style={styles.nameTitle}>
              {`${student.first_name} ${student.last_name}`}
            </a>
            <div style={{ display: 'inline-block' }}>
              {this.renderBulletSpacer()}
              <a href={Routes.school(student.school_id)} style={styles.subtitleItem}>
                {student.school_name}
              </a>
              {this.renderBulletSpacer()}
              {this.renderHomeroomOrEnrollmentStatus()}
              {this.renderBulletSpacer()}
              <span style={styles.subtitleItem}>
                {`Grade ${student.grade}`}
              </span>
              {this.renderDateOfBirth()}
              {this.renderStudentAddress()}
            </div>
          </div>
          <div
            style={{
              width: '15em',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <RiskBubble riskLevel={student.student_risk_level.level} />
          </div>
        </div>
      );
    },

    renderBulletSpacer() {
      return (
        <span style={styles.subtitleItem}>
          •
        </span>
      );
    },

    renderHomeroomOrEnrollmentStatus() {
      const student = this.props.student;
      if (student.enrollment_status === 'Active') {
        if (student.homeroom_name) {
          return (
            <a
              className="homeroom-link"
              href={Routes.homeroom(student.homeroom_id)}
              style={styles.subtitleItem}
            >
              {`Homeroom ${student.homeroom_name}`}
            </a>
          );
        }

        return (<span style={styles.subtitleItem}>No homeroom</span>);
      }
      return (
        <span style={styles.subtitleItem}>
          {student.enrollment_status}
        </span>
      );
    },

    renderDateOfBirth() {
      const student = this.props.student;
      const dateOfBirth = student.date_of_birth;
      if (!dateOfBirth) return null;

      const momentDOB = moment.utc(dateOfBirth);
      const ageInWords = ` (${moment().diff(momentDOB, 'years')} years old)`;

      return (
        <span>
          {this.renderBulletSpacer()}
          <span style={styles.subtitleItem}>
            {momentDOB.format('M/D/YYYY')}
            {ageInWords}
          </span>
        </span>
      );
    },

    renderStudentAddress() {
      const student = this.props.student;
      const studentaddress = student.student_address;
      if (!studentaddress) return null;

      return (
        <span>
          {this.renderBulletSpacer()}
          <span style={styles.subtitleItem}>
            {studentaddress}
          </span>
        </span>
      );
    },
  });
}());
