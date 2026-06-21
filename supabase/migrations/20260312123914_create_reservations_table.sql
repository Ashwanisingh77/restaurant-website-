/*
  # Create reservations table for restaurant bookings

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key) - Unique identifier for each reservation
      - `name` (text) - Full name of the guest
      - `email` (text) - Email address for confirmation
      - `phone` (text) - Contact phone number
      - `guests` (text) - Number of guests
      - `date` (date) - Reservation date
      - `time` (text) - Reservation time slot
      - `message` (text, nullable) - Special requests or notes
      - `status` (text) - Reservation status (pending, confirmed, cancelled)
      - `created_at` (timestamptz) - Timestamp when reservation was created

  2. Security
    - Enable RLS on `reservations` table
    - Add policy for public insert (allows anyone to make a reservation)
    - Add policy for authenticated users to view all reservations (for restaurant staff)
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  guests text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a reservation"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);