---
sidebar_position: 2
title: Docker installation
---

# Install Milvago Community

## 1. Prepare the server

Use a Linux server with Internet access, Bash, `curl`, and a `root` account or permission to use `sudo`. The `curl` command must be available before you run the command below.

Choose the address people will use to open Milvago, such as `https://milvago.example.com`. For HTTPS access through a domain, configure its DNS and an HTTPS reverse proxy that forwards requests to the Milvago server's private IP address on port **4020**. Allow that connection through the server firewall. The installer configures the application URL; it does not create DNS records or issue your HTTPS certificate.

Make sure the server clock is synchronized, particularly before configuring two-factor authentication.

### Production operation

The installed profile runs Keycloak with `start` in production mode behind the HTTPS reverse proxy you provide. Keep the proxy in front of port `4020`, preserve the `Host` header, and send `X-Forwarded-Proto: https`.

Mailpit is disabled in the installed profile. It is available only through the `development-mail` profile for intentional development use; it is not a production mail service. Configure a real SMTP server during setup or later in **Administration > Settings**, then send a test message before relying on member invitations or password-reset email. Without SMTP, those messages are unavailable.

On every installer run, an already-running development Mailpit service is stopped without deleting its captured messages. The installer removes only the factory SMTP configuration (`mail:1025` with `no-reply@milvago.test`); it preserves SMTP settings configured by an operator.

The gateway and development-mail containers run as `65532:65532` with all Linux capabilities dropped; the gateway adds only the capability required to bind its port. Use a dedicated sudo-capable installation account that is not a member of the `docker` group. Keep volume ownership specific to the service that owns each volume. Rootless Docker is not promised by this installation. Docker `userns-remap` is not enabled or qualified yet: test host-network readiness probing and volume ownership before enabling it.

## 2. Run the installer

```bash
curl -fsSL https://get.milvago.ai | bash
```

No GitHub account, token, or registry login is required. This address serves the latest published installer; each installer pins an exact server version and image digest.

The installer checks the required utilities, including `tar`, `gzip`, and CA certificates. It can install missing prerequisites through `apt-get`, `dnf`, or `yum`, and install Docker Engine and Compose on supported distributions. It may ask for your `sudo` password. This does not guarantee compatibility with every Linux distribution or version.

The server image is public. The installer verifies its cosign signature and checks the Community agent bundle's SHA-256, signed Ed25519 update manifests, and expiration before making agent downloads available.

## 3. Enter the public URL

At the prompt:

```text
Milvago public URL:
```

Enter the full address:

```text
https://milvago.example.com
```

The `https://` or `http://` prefix is required. You may include a port, but no path, query string, or fragment. An invalid URL stops the installer with an explanatory message. It does not add a protocol automatically.

The prompt reads from the terminal even when the script is piped into Bash.

### Provide the URL directly

To skip the URL prompt, supply it to Bash in the same command:

```bash
curl -fsSL https://get.milvago.ai | MILVAGO_PUBLIC_URL=https://milvago.example.com bash
```

Replace the example address with your own. The same validation applies. This skips the URL question; it does not suppress any required `sudo` authentication. Without a terminal, `MILVAGO_PUBLIC_URL` is required.

## 4. Complete setup

When installation finishes:

1. Open the URL printed by the installer.
2. Retrieve the `MILVAGO_SETUP_TOKEN` value from the `.env` file at the displayed path. The default installation directory is `$HOME/milvago-community`; `MILVAGO_DIR` can override it.
3. Enter this setup token in the browser wizard and complete the configuration, including creation of the administrator account. This is a Milvago setup token, not a GitHub token.
4. Follow [Install the components](composants.md) to enroll your first device.

Keep the `.env` file private: it contains the instance's generated secrets.

## Install a specific version

To choose a release explicitly and verify its downloaded files before execution, use its exact version URL. For server **1.0.0**, which uses Community agent and extension **0.6.4**:

```bash
mkdir -p milvago-install && cd milvago-install
release_url=https://github.com/Milvago-AI/milvago-server/releases/download/v1.0.0
curl -fLO "$release_url/install-private.sh"
curl -fLO "$release_url/SHA256SUMS"
curl -fLO "$release_url/release.json"
sha256sum --check SHA256SUMS
bash install-private.sh
```

Run the installer only if both checksum checks report `OK`. The filename `install-private.sh` is historical; these downloads require no GitHub credentials.
