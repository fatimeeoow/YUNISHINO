import { createClient } from '@supabase/supabase-js';

// Usamos la URL que me diste.
// ¡OJO! La KEY (anon/public key) la debes sacar de los "Project Settings -> API" de Supabase
const supabaseUrl = 'https://ytltwpgiexqfpghjdzwx.supabase.co';
const supabaseKey = 'TU_CLAVE_ANON_AQUI_SACADA_DE_SUPABASE'; 

export const supabase = createClient(supabaseUrl, supabaseKey);