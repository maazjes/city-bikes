import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../util/db.js';

class Station extends Model<InferAttributes<Station>, InferCreationAttributes<Station>> {
  declare id: number;

  declare name: string;

  declare city?: string;

  declare address?: string;

  declare capacity?: number;

  declare operator?: string;

  declare latitude?: number;

  declare longitude?: number;
}

Station.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    operator: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'station'
  }
);

export default Station;
