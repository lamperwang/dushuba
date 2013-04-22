class CreateUserInvites < ActiveRecord::Migration
  def up 


    create_table :user_invites do |t|
      t.string :real_name
      t.string :invite_code
      t.string :unit
      t.string :sex
      t.smallint :status
      t.timestamps
    end

    require 'csv'
    csv_text = File.read('codes.csv')
    csv = CSV.parse(csv_text, :headers=>true)
    csv.each do |row|
      row = row.to_hash.with_indifferent_access
      row.slice!("real_name","invite_code","unit","sex")
      puts row
      UserInvite.create!(row)

    end

  end
end
