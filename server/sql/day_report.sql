SELECT    date_trunc('day', dd)::date AS date,
          (
            SELECT  json_agg(b.*)
            FROM    (
              SELECT      booking.id,
                          booking.dealership_id,
                          booking.status,
                          booking.type,
                          booking.start_date::character varying,
                          booking.end_date::character varying,
                          booking.days::character varying,
                          booking.selected_days::character varying,
                          booking.rate::character varying,
                          booking.cost::character varying,
                          booking.created_at::character varying,
                          booking.updated_at::character varying,
                          booking.created_by,
                          booking.updated_by,
                          dealership.name as dealership_name,
                          "user".name as user_name
              FROM        booking
              INNER JOIN  dealership
              ON          booking.dealership_id = dealership.id
              INNER JOIN  "user"
              ON          booking.created_by = "user".id
              WHERE       booking.replaced_at IS NULL
              AND         booking.status = 'Approved'
              AND         booking.start_date <= dd
              AND         booking.end_date >= dd
              AND         (?::uuid IS NULL OR booking.dealership_id = ?::uuid)
              ORDER BY    dealership.name, booking.type
            ) AS b
          ) AS bookings
FROM      generate_series(?::date, ?::date, '1 day'::interval) dd;
