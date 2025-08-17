# 3suite-db

db is a flexible, plugin-focused key-value database meant to serve as a backend for 3suite projects.

### macOS builds

we currently do not support notarization for macOS builds.
to run mac builds, flag them as safe for gatekeeper with the following command:

`xattr -c <path_to_mac_executable>`
