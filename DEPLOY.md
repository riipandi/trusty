# Deployment

```sh
cat fly.example.toml > fly.toml
sed -i -e "s/CHANGEME_APP_NAME/trusty-demo/g" fly.toml

fly apps create --name trusty-demo -o personal
fly secrets set ___________
fly deploy --remote-only
fly logs
```

### Setup custom domain

Point DNS A Record to the assigned IP address. Or, if using subdomain you can
point `trusty-demo.fly.dev` CNAME record.

```sh
# Allocate IPs and setup custom domain (optional)
fly ips allocate-v4 -a trusty
fly ips allocate-v6 -a trusty
fly certs create example.com -a trusty
```
