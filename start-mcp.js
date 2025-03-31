const { spawn } = require('child_process');

const server = spawn('npx', [
  '-y',
  '@modelcontextprotocol/server-postgres',
  'postgresql://postgres.fzredrzlnycvcyxecwpn:GVoyEcBJis3CC04e@aws-0-sa-east-1.pooler.supabase.com:5432/postgres'
], {
  stdio: 'inherit'
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
}); 