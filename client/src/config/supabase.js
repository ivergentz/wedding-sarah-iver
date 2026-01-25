import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// RSVP Functions
export const addRSVP = async (rsvpData) => {
  const { data, error } = await supabase
    .from('rsvps')
    .insert([{
      name: rsvpData.name,
      email: rsvpData.email,
      attending: rsvpData.attending,
      guests: parseInt(rsvpData.guests),
      message: rsvpData.message || '',
    }])
    .select()

  if (error) {
    console.error('Error adding RSVP:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export const getRSVPs = async () => {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching RSVPs:', error)
    return []
  }

  return data
}
