class FakeStudent
  def initialize(school, homeroom)
    @school = school
    @homeroom = homeroom
    @student = Student.create(data)
    @newstudent = rand > 0.95
    add_attendance_events
    add_discipline_incidents
    add_deprecated_interventions
    add_event_notes
    add_services
    add_student_assessments_from_x2
    add_student_assessments_from_star
    add_student_assessments_from_access
    add_student_to_homeroom
  end

  def student
    @student
  end

  private

  def add_student_to_homeroom
    if @homeroom
      @homeroom.students << @student
    end
  end

  def grade
    return @homeroom.grade if @homeroom
    return 3
  end

  def data
    base_data.merge(plan_504)
             .merge(program_assigned_and_sped_disability)
  end

  DISNEY_FIRST_NAMES = [
    "Aladdin", "Chip", "Daisy", "Mickey", "Minnie",
    "Donald", "Elsa", "Mowgli", "Olaf", "Pluto",
    "Pocahontas", "Rapunzel", "Snow", "Winnie"
  ]

  DISNEY_LAST_NAMES = [
    "Disney", "Duck", "Kenobi", "Mouse", "Pan", "Poppins", "Skywalker", "White"
  ]

  FIVE_YEARS_OF_SECONDS = 157766400

  def base_data
    {
      school: @school,
      date_of_birth: fake_date_of_birth,
      enrollment_status: enrollment_status,
      grade: grade,
      first_name: DISNEY_FIRST_NAMES.sample,
      last_name: DISNEY_LAST_NAMES.sample,
      local_id: unique_local_id,
      limited_english_proficiency: ["Fluent", "FLEP-Transitioning", "FLEP"].sample,
      free_reduced_lunch: ["Free Lunch", "Not Eligible"].sample,
      home_language: ["Spanish", "English", "Portuguese", "Haitian-Creole"].sample,
      race: ['Black', 'White', 'Asian'].sample,
      hispanic_latino: [true, false].sample,
      gender: ['M', 'F'].sample,
    }
  end

  def start_of_this_school_year
    DateTime.new(DateTime.now.year, 9, 1)
  end

  def kindergarten_year
    start_of_this_school_year - grade.to_i.years
  end

  def fake_date_of_birth
    kindergarten_year - 5.years + rand(0..365).days
  end

  def random_local_id
    "000#{rand(1000)}"
  end

  def unique_local_id
    existing_local_ids = Student.pluck(:local_id)
    local_id = random_local_id
    while existing_local_ids.include?(local_id)
      local_id = random_local_id
    end
    local_id
  end

  def enrollment_status
    7.in(8) ? 'Active' : 'Transferred'
  end

  def plan_504
    2.in(100) ? { plan_504: "504" } : { plan_504: "Not 504" }
  end

  def program_assigned_and_sped_disability
    if 20.in(100)
      { program_assigned: "Sp Ed" }.merge(sped).merge(disability)
    else
      if 15.in(100)
        { program_assigned: ["Reg Ed", "2Way English", "2Way Spanish"].sample }.merge(disability)
      else
        { program_assigned: ["Reg Ed", "2Way English", "2Way Spanish"].sample }
      end
    end
  end

  def sped
    {
      sped_level_of_need: ["High", "Moderate", "Low >= 2", "Low < 2"].sample,
      sped_placement: ["Full Inclusion", "Partial Inclusion", "Private Separate"].sample
    }
  end

  def disability
    {
      disability: ["Specific LDs", "Emotional", "Communication", "Autism"].sample
    }
  end

  def create_x2_assessment_generators(student)
    [
      FakeMcasMathResultGenerator.new(student),
      FakeMcasElaResultGenerator.new(student),
      FakeDibelsResultGenerator.new(student),
      FakeAccessResultGenerator.new(student)
    ]
  end

  def add_student_assessments_from_x2
    create_x2_assessment_generators(@student).each do |assessment_generator|
      unless @newstudent
        5.times do
          StudentAssessment.new(assessment_generator.next).save
        end
      end
    end
  end

  def add_student_assessments_from_star
    unless @newstudent
      star_period_days = 90
      # Define semi-realistic date ranges for STAR assessments
      start_date = DateTime.new(2010, 9, 1)
      now = DateTime.now
      assessment_count = (now - start_date).to_i / star_period_days
      options = {
        start_date: start_date,
        star_period_days: star_period_days
      }

      generators = [
        FakeStarMathResultGenerator.new(@student, options),
        FakeStarReadingResultGenerator.new(@student, options)
      ]
      generators.each do |star_assessment_generator|
        assessment_count.times do
          StudentAssessment.new(star_assessment_generator.next).save
        end
      end
    end
  end

  def add_student_assessments_from_access
    return if @student.limited_english_proficiency == 'Fluent'
    fake_access_generator = FakeAccessResultGenerator.new(@student)
    StudentAssessment.new(fake_access_generator.next).save
  end

  def add_attendance_events
    d = {
      0 => 0.04,
      (1..6) => 0.41,
      (15..28) => 0.52,
      (29..100) => 0.03,
    }

    events_for_year = DemoDataUtil.sample_from_distribution(d)
    events_for_year.times do
      # Randomly determine when it occurred.
      occurred_at = Time.at(DateTime.now.to_i - (rand * FIVE_YEARS_OF_SECONDS))

      attendance_event = [Absence.new, Tardy.new].sample
      attendance_event.occurred_at = occurred_at
      attendance_event.student = student

      attendance_event.save
    end
  end

  def add_discipline_incidents
    d = {
      0 => 0.83,
      1 => 0.10,
      2 => 0.03,
      (3..5) => 0.03,
      (6..15) => 0.01,
    }

    events_for_year = DemoDataUtil.sample_from_distribution(d)
    events_for_year.times do
      # Randomly determine when it occurred.
      occurred_at = Time.at(DateTime.now.to_i - (rand * FIVE_YEARS_OF_SECONDS))

      discipline_incident = DisciplineIncident.new(
        FakeDisciplineIncident.data.merge({
          occurred_at: occurred_at,
          student: student
        })
      )

      discipline_incident.save
    end
  end

  def add_deprecated_interventions
    15.in(100) do
      generator = FakeInterventionGenerator.new(@student)
      intervention_count = Rubystats::NormalDistribution.new(3, 6).rng.round
      intervention_count.times do
        intervention = Intervention.new(generator.next)
        intervention.save!
      end
    end
    nil
  end

  #These are saving for some students only.
  def add_event_notes
    generator = FakeEventNoteGenerator.new(@student)
    rand(0..9).times { EventNote.new(generator.next).save! }
    nil
  end

  #These are saving for some students only.
  def add_services
    generator = FakeServiceGenerator.new(@student)
    service_counts = 20.in(100) ? rand(1..5) : 0
    service_counts.times { Service.new(generator.next).save! }
    nil
  end
end
