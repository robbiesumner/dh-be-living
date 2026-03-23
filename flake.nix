{
  description = "DH Be Living";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};

        app = pkgs.stdenv.mkDerivation (finalAttrs: {
          pname = "dh-be-living";
          version = "0.1.0";
          src = ./.;

          CI = "true";

          nativeBuildInputs = [
            pkgs.nodejs_20
            pkgs.pnpm
            pkgs.pnpmConfigHook
          ];

          pnpmDeps = pkgs.fetchPnpmDeps {
            inherit (finalAttrs) pname version src;
            hash = "sha256-24RQbveHrE3rSQGmETJoD/jPdt43/ImCPVbjoO9Hbls=";
            fetcherVersion = 3;
          };

          buildPhase = ''
            runHook preBuild
            pnpm run build
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r build package.json node_modules drizzle $out/
            runHook postInstall
          '';
        });

        dockerImage = pkgs.dockerTools.buildLayeredImage {
          name = "dh-be-living";
          tag = "latest";
          created = "now";
          contents = [pkgs.nodejs_20 pkgs.bash pkgs.coreutils];

          config = {
            Cmd = ["${pkgs.nodejs_20}/bin/node" "${app}/build/index.js"];
            Env = [
              "NODE_ENV=production"
              "PORT=3000"
            ];
            WorkingDir = "${app}";
            ExposedPorts = {"3000/tcp" = {};};
          };
        };
      in {
        packages = {
          default = app;
          docker = dockerImage;
        };

        devShells.default = pkgs.mkShell {
          buildInputs = let
            pythonEnv = pkgs.python3.withPackages (ps:
              with ps; [
                faker
              ]);
          in
            with pkgs; [
              nodejs_20
              pnpm
              sqlite
              pythonEnv
            ];

          shellHook = ''
            echo "🏠 Welcome to the DH Be Living dev environment!"
            echo "Node: $(node --version)"
            echo "SQLite: $(sqlite3 --version | awk '{print $1}')"
            echo "Python: $(python --version) (with Faker included)"
            echo "----------------------------------------------------"
            echo "Run dev server: pnpm run dev"
          '';
        };
      }
    );
}
