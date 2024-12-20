import NoArg from 'noarg'
import convertToRunAsAdmin from './convertToRunAsAdmin'

const app = NoArg.create('exe-admin', {
  listArgument: {
    name: 'exe/s',
    minLength: 1,
    type: NoArg.string(),
  },

  flags: {
    overwrite: NoArg.boolean().description('Overwrite the original file'),
  },
})

app.on(async ([args], flags) => {
  const inputOutputMappings = args.map((exe) => [
    exe,
    flags.overwrite ? exe : exe.replace('.exe', ' (Admin).exe'),
  ])

  inputOutputMappings.forEach(([input, output]) => {
    convertToRunAsAdmin(input, output)
  })
})

app.start()
