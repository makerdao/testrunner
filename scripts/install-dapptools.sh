#!/usr/bin/env bash
# run this file with "source" or "." so it can affect the environment

set -e

export USER=circleci

# sudo mkdir -m 0755 /nix && sudo chown circleci /nix
# sudo mount -o bind /home/circleci/build/makerdao/dai.js/nix /nix
curl https://dapp.tools/install | sh
. /home/circleci/.nix-profile/etc/profile.d/nix.sh
