class StudentsImporter < Struct.new :school_scope, :client, :log, :progress_bar

  def remote_file_name
    'students_export.txt'
  end

  def data_transformer
    CsvTransformer.new
  end

  def filter
    SchoolFilter.new(['HEA', 'WSNS', 'ESCS', 'BRN', 'KDY', 'AFAS', 'WHCS', 'SHS'])
  end

  def school_ids_dictionary
    @dictionary ||= School.all.map { |school| [school.local_id, school.id] }.to_h
  end

  def import_row(row)
    student = StudentRow.new(row, school_ids_dictionary).build

    student.save! unless student.registration_date_in_future

    if row[:homeroom].present?
      assign_student_to_homeroom(student, row[:homeroom])
    end

    student.create_student_risk_level!
  end

  def assign_student_to_homeroom(student, homeroom_name)
    return unless student.active?

    homeroom = Homeroom.where({
      name: homeroom_name,
      school: student.school
    }).first_or_create!

    homeroom.students << student
  end

end
