# Working-Bar

A command line tool to make git ssh configuration easy

## Getting Started

These instructions will show you how to quickly create an ssh key and add it to your github account without leaving the terminal

### Installing

```
npm install -g git-key
```

### Using

Create your ssh key

```
git-key
```

Create an ssh key with a specified name

```
git-key add -n myName
```

Create an ssh key with a passphrase (No passphrase is default)
```
git-key add -p // Will prompt for passphrase
git-key add -p pass // Supplied passphrase "pass"
```

Force replace existing ssh key (Forgo confirmation prompt)

```
git-key add -f
```

Combine options

```
git-key add -fn myName -p pass
```

Configure username and/or password.  WARNING!!! This is not secured.  Your github credentials will be stored in a configuration file unencrypted currently.

```
git-key config -u example@example.com // Will still prompt for password
git-key config -u example@example.com -p password
```

Configure ssh directory

```
git-key config -d ~/Developer/MyDirectory
```

Reset configuration to default values (directory: ~/.ssh, username: null, password: null)

```
git-key reset
```

Print help

```
git-key -h
git-key add -h
// etc
```

## Authors

* **Jay Deaton** - [Github](https://github.com/jayrdeaton)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
