#!/bin/bash
cat > .env.local << 'EOL'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hzwutclcpznclzucsnxz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6d3V0Y2xjcHpuY2x6dWNzbnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDgzNjYsImV4cCI6MjA0NzUyNDM2Nn0.dx_KxkuUmXSmCtNEjXLXW7ZQMpLU68RMUL7_eo560-g
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6d3V0Y2xjcHpuY2x6dWNzbnh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTk0ODM2NiwiZXhwIjoyMDQ3NTI0MzY2fQ.jZWOUc5yykPpRlPolFldUztkWkJT8UqQKjHGFbi2LqA
EOL
