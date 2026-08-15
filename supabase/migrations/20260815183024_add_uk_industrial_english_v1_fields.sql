alter table public.recovery_cases
  add column questionnaire_version text,
  add column study_role text,
  add column study_role_other text,
  add column fleet_size text,
  add column delay_frequency text,
  add column study_machine_type text,
  add column study_machine_type_other text,
  add column main_delay text,
  add column main_delay_other text,
  add column other_delays text[],
  add column other_delays_other text,
  add column additional_resources_needed text,
  add column additional_resources text[],
  add column additional_resources_other text,
  add column resource_source text,
  add column resource_source_other text,
  add column resource_arrangement text,
  add column resource_arrangement_other text,
  add column time_to_resource text,
  add column current_recovery_method text,
  add column recovery_outcome text,
  add column recovery_outcome_other text,
  add column avoidable_time text,
  add column biggest_difference text,
  add column biggest_difference_other text,
  add column customer_working_time_lost text,
  add column tomorrow_easier text,
  add column findings_preference text,
  add column follow_up_chat text,
  add column follow_up_contact_details text;

alter table public.recovery_cases
  add constraint recovery_cases_questionnaire_version_check check (
    questionnaire_version is null or questionnaire_version = 'uk_industrial_english_v1'
  ),
  add constraint recovery_cases_study_role_check check (
    study_role is null or study_role in ('Service Manager / Service Controller', 'Engineer / Technician', 'Fleet / Operations', 'Hire Desk / Branch', 'Owner / Director', 'Manufacturer / OEM', 'Other')
  ),
  add constraint recovery_cases_fleet_size_check check (
    fleet_size is null or fleet_size in ('Under 50 machines', '50–249', '250–999', '1,000+', 'Not applicable', 'Prefer not to say')
  ),
  add constraint recovery_cases_delay_frequency_check check (
    delay_frequency is null or delay_frequency in ('Most days', 'A few times a week', 'About once a week', 'A few times a month', 'Less often', 'Hard to say')
  ),
  add constraint recovery_cases_study_machine_type_check check (
    study_machine_type is null or study_machine_type in ('Scissor lift', 'Boom lift', 'Other', 'Not sure')
  ),
  add constraint recovery_cases_main_delay_check check (
    main_delay is null or main_delay in ('Getting the right information from site', 'Working out what was actually wrong', 'Finding the right engineer', 'Waiting for an engineer to become available', 'Identifying the right part', 'Waiting for the part', 'Waiting for manufacturer / OEM support', 'Arranging transport', 'Finding a replacement / cross-hire machine', 'Communication / coordination', 'Something else')
  ),
  add constraint recovery_cases_other_delays_check check (
    other_delays is null or (
      cardinality(other_delays) > 0
      and other_delays <@ array['Getting the right information from site', 'Working out what was actually wrong', 'Finding the right engineer', 'Waiting for an engineer to become available', 'Identifying the right part', 'Waiting for the part', 'Waiting for manufacturer / OEM support', 'Arranging transport', 'Finding a replacement / cross-hire machine', 'Communication / coordination', 'No — that was the main issue', 'Something else']::text[]
      and (not ('No — that was the main issue' = any(other_delays)) or cardinality(other_delays) = 1)
    )
  ),
  add constraint recovery_cases_additional_resources_needed_check check (
    additional_resources_needed is null or additional_resources_needed in ('Yes', 'No', 'Not sure')
  ),
  add constraint recovery_cases_additional_resources_check check (
    additional_resources is null or (
      cardinality(additional_resources) > 0
      and additional_resources <@ array['Engineer', 'Manufacturer / OEM support', 'Technical advice', 'Part(s)', 'Transport', 'Replacement / cross-hire machine', 'Other']::text[]
    )
  ),
  add constraint recovery_cases_resource_source_check check (
    resource_source is null or resource_source in ('Another depot / branch', 'Manufacturer / OEM', 'Existing supplier', 'Independent engineer', 'Another rental company', 'Other')
  ),
  add constraint recovery_cases_resource_arrangement_check check (
    resource_arrangement is null or resource_arrangement in ('Someone we already knew', 'Phone', 'WhatsApp / messaging', 'Internal system', 'Manufacturer / supplier portal', 'Online search', 'Other')
  ),
  add constraint recovery_cases_time_to_resource_check check (
    time_to_resource is null or time_to_resource in ('Under 30 minutes', '30–60 minutes', '1–2 hours', '2–4 hours', 'More than 4 hours', 'Next day or longer', 'Can''t remember')
  ),
  add constraint recovery_cases_current_recovery_method_check check (
    current_recovery_method is null or current_recovery_method in ('Very well', 'Fairly well', 'It''s mixed', 'Not very well', 'Poorly')
  ),
  add constraint recovery_cases_recovery_outcome_check check (
    recovery_outcome is null or recovery_outcome in ('We fixed the original machine', 'Remote fix / operator action', 'Replacement from our own fleet', 'Cross-hire / machine from another rental company', 'They used another machine already on site', 'They waited for the original machine to be repaired', 'Other', 'Don''t know')
  ),
  add constraint recovery_cases_avoidable_time_check check (
    avoidable_time is null or avoidable_time in ('Yes', 'Probably', 'No', 'Not sure')
  ),
  add constraint recovery_cases_biggest_difference_check check (
    biggest_difference is null or biggest_difference in ('Better information from site', 'Knowing the fault sooner', 'Knowing who to contact', 'Getting an engineer sooner', 'Getting the right part sooner', 'Faster manufacturer / OEM support', 'Getting a replacement machine sooner', 'Better communication / coordination', 'Something else')
  ),
  add constraint recovery_cases_customer_working_time_lost_check check (
    customer_working_time_lost is null or customer_working_time_lost in ('Under 1 hour', '1–2 hours', '2–4 hours', '4–8 hours', 'About a day', 'More than a day', 'They kept working with a replacement machine', 'Don''t know')
  ),
  add constraint recovery_cases_findings_preference_check check (
    findings_preference is null or findings_preference in ('Yes', 'No')
  ),
  add constraint recovery_cases_follow_up_chat_check check (
    follow_up_chat is null or follow_up_chat in ('Yes', 'Maybe', 'No')
  ),
  add constraint recovery_cases_industrial_v1_resource_scope check (
    questionnaire_version is distinct from 'uk_industrial_english_v1'
    or (
      (additional_resources_needed = 'Yes' and additional_resources is not null and resource_source is not null and resource_arrangement is not null and time_to_resource is not null)
      or
      (additional_resources_needed in ('No', 'Not sure') and additional_resources is null and resource_source is null and resource_arrangement is null and time_to_resource is null)
    )
  ),
  add constraint recovery_cases_industrial_v1_avoidable_scope check (
    questionnaire_version is distinct from 'uk_industrial_english_v1'
    or (
      (avoidable_time in ('Yes', 'Probably') and biggest_difference is not null)
      or
      (avoidable_time in ('No', 'Not sure') and biggest_difference is null)
    )
  );

comment on column public.recovery_cases.questionnaire_version is
  'Questionnaire copy/version identifier. Null denotes the earlier MEWP Breakdown & Recovery Survey.';
comment on column public.recovery_cases.tomorrow_easier is
  'Free-text answer to what would make the same breakdown easier tomorrow.';
comment on column public.recovery_cases.follow_up_contact_details is
  'Optional contact detail supplied with the UK Industrial English V1.0 follow-up questions.';
