# Generator templates

Use `--template-path ./templates` or set `templatePath` in the CLI configuration.
Relative paths resolve from the working directory. Copy the packaged `.eta` files
and change any of `frame.eta`, `base-frame.eta`, `host-function.eta`, or
`security-provider.eta`. Missing files fall back individually to bundled defaults.
The existing `it` properties in each template describe its rendering data.

Run `frame-cli template-eject` to export defaults into `./templates`.
Existing files are preserved; missing files are added. Then pass
`--template-path ./templates` to a generation command.
