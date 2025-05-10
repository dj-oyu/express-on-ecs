# express-on-ecs

TypeScript + React + Vite + Express 構成のWebアプリを、Amazon ECS (Fargate) で本番運用するためのサンプルプロジェクト。

---

## 構成

- React (Vite) + Express (TypeScript)
- Dockerコンテナ化
- AWS ECR/ECS (Fargate) デプロイ
- GitHub ActionsによるCI/CD
- ユニットテスト・Lint自動化

---

## セットアップ

### 1. ローカル開発

```sh
# 依存インストール
npm install

# 開発サーバー起動
npm run dev
```

### 2. Dockerビルド（ローカル確認用）

```sh
docker build -t express-on-ecs .
docker run -p 3000:3000 --env-file express-on-ecs/.env.example express-on-ecs
```

---

## デプロイ手順（Amazon ECS/Fargate）

詳細は [docs/06_deploy.md](../docs/06_deploy.md) 参照

### 1. ECRリポジトリ作成
```sh
aws ecr create-repository --repository-name express-on-ecs
```

### 2. Dockerイメージビルド＆ECRプッシュ
```sh
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com
docker build -t express-on-ecs .
docker tag express-on-ecs:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/express-on-ecs:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/express-on-ecs:latest
```

### 3. ECSタスク定義登録
```sh
aws ecs register-task-definition --cli-input-json file://express-on-ecs/task-definition.json
```

### 4. ECSサービス更新
```sh
aws ecs update-service --cluster <CLUSTER_NAME> --service <SERVICE_NAME> --force-new-deployment
```

---

## CI/CD

- `.github/workflows/ci.yml` で自動テスト・Lint・ECR push・ECSデプロイを自動化
- mainブランチへのマージはCI通過が必須

---

## 環境変数

- `express-on-ecs/.env.example` を参考に `.env` を作成
- ECSタスク定義の `environment` で注入

---

## 参考ドキュメント

- [docs/01_prd.md](../docs/01_prd.md) 要件定義書
- [docs/02_user_journey.md](../docs/02_user_journey.md) ユーザージャーニー
- [docs/03_tech_stack.md](../docs/03_tech_stack.md) 技術構成
- [docs/04_architecture.md](../docs/04_architecture.md) アーキテクチャ
- [docs/05_folder_structure.md](../docs/05_folder_structure.md) フォルダ構成
- [docs/06_deploy.md](../docs/06_deploy.md) デプロイ手順

---

## Git運用ポリシー

- ブランチ戦略: main, feature/*, fix/*
- コミットprefix: feat, fix, docs, style, refactor, test, chore
- 1コミット1目的・PRベース運用

---

## 推奨Gitコマンド例

```sh
# 変更をステージ
git add .

# コミット
git commit -m "feat: ECS用タスク定義とデプロイ手順を追加"

# プッシュ
git push origin feature/ecs-deploy
